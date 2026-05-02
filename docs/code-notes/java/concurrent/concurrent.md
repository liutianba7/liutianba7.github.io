# Java 多线程开发

> 本文档整理 Java 多线程开发的常用代码实践，配套理论知识请参考 [JUC 基础](../../../java/01_Java_Core/juc.md)。

## 一、线程的创建

### 1.1 继承 Thread 类

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + ": hello world");
    }
}

public class Demo {
    public static void main(String[] args) {
        new MyThread().start();
    }
}
```

### 1.2 实现 Runnable 接口

```java
public class Demo {
    public static void main(String[] args) {
        new Thread(() -> System.out.println("hello world")).start();
    }
}
```

### 1.3 实现 Callable 接口（有返回值）

```java
public class Demo {
    public static void main(String[] args) throws Exception {
        FutureTask<String> task = new FutureTask<>(() -> {
            Thread.sleep(1000);
            return "callable result";
        });
        new Thread(task).start();
        System.out.println(task.get()); // 阻塞获取结果
    }
}
```

### 1.4 线程池创建

```java
// 使用线程池
ThreadPoolExecutor executor = new ThreadPoolExecutor(
        2, // 核心线程数
        5, // 最大线程数
        1, // 线程空闲时间
        TimeUnit.SECONDS, // 时间单位
        new ArrayBlockingQueue<>(3), // 阻塞队列
        Executors.defaultThreadFactory(), // 线程工厂
        new ThreadPoolExecutor.DiscardOldestPolicy() // 拒绝策略
);

// 使用 execute
executor.execute(() -> {
    System.out.println("hello world 1");
});
// 使用 submit
Future<Integer> submitted = executor.submit(() -> {
    return 1;
});
System.out.println(submitted.get());
// 关闭线程池
executor.shutdown();
```

---

## 二、线程同步与锁

### 2.1 synchronized 关键字

```java
public class SynchronizedDemo {
    private int count = 0;

    // 同步实例方法 - 锁 this
    public synchronized void increment() {
        count++;
    }

    // 同步代码块 - 锁指定对象
    public void decrement() {
        synchronized (this) {
            count--;
        }
    }

    // 同步静态方法 - 锁 Class 对象
    public static synchronized void staticMethod() {
        System.out.println("static synchronized method");
    }

    public static void main(String[] args) throws InterruptedException {
        SynchronizedDemo demo = new SynchronizedDemo();

        // 多线程并发修改
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) demo.increment();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) demo.increment();
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("count = " + demo.count); // 输出 2000
    }
}
```

### 2.2 ReentrantLock

#### 基本使用

```java
public class ReentrantLockDemo {
    private final ReentrantLock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock(); // 手动加锁
        try {
            count++;
        } finally {
            lock.unlock(); // 必须在 finally 中释放锁
        }
    }

    // 尝试获取锁，不阻塞
    public void tryLockDemo() {
        if (lock.tryLock()) {
            try {
                System.out.println("获取锁成功");
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("获取锁失败，做其他事情");
        }
    }

    // 带超时的尝试获取锁
    public void tryLockWithTimeout() throws InterruptedException {
        if (lock.tryLock(3, TimeUnit.SECONDS)) {
            try {
                System.out.println("3秒内获取锁成功");
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("超时未获取到锁");
        }
    }
}
```

#### 死锁演示与解决

```java
public class DeadlockDemo {
    private static final Object lockA = new Object();
    private static final Object lockB = new Object();

    public static void main(String[] args) {
        // 死锁场景：线程1持有A等B，线程2持有B等A
        new Thread(() -> {
            synchronized (lockA) {
                System.out.println("Thread-1 持有 lockA，等待 lockB");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockB) { // 等待 lockB，但被 Thread-2 持有
                    System.out.println("Thread-1 获取 lockB");
                }
            }
        }, "Thread-1").start();

        new Thread(() -> {
            synchronized (lockB) {
                System.out.println("Thread-2 持有 lockB，等待 lockA");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockA) { // 等待 lockA，但被 Thread-1 持有
                    System.out.println("Thread-2 获取 lockA");
                }
            }
        }, "Thread-2").start();
    }
}
```

**使用 ReentrantLock 解决死锁（tryLock 超时机制）：**

```java
public class DeadlockSolution {
    private static final ReentrantLock lockA = new ReentrantLock();
    private static final ReentrantLock lockB = new ReentrantLock();

    public static void main(String[] args) {
        new Thread(() -> {
            try {
                if (lockA.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        System.out.println("Thread-1 持有 lockA");
                        Thread.sleep(100);
                        if (lockB.tryLock(1, TimeUnit.SECONDS)) {
                            try {
                                System.out.println("Thread-1 获取 lockB，执行业务");
                            } finally {
                                lockB.unlock();
                            }
                        } else {
                            System.out.println("Thread-1 获取 lockB 失败，放弃");
                        }
                    } finally {
                        lockA.unlock();
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "Thread-1").start();

        new Thread(() -> {
            try {
                if (lockB.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        System.out.println("Thread-2 持有 lockB");
                        Thread.sleep(100);
                        if (lockA.tryLock(1, TimeUnit.SECONDS)) {
                            try {
                                System.out.println("Thread-2 获取 lockA，执行业务");
                            } finally {
                                lockA.unlock();
                            }
                        } else {
                            System.out.println("Thread-2 获取 lockA 失败，放弃");
                        }
                    } finally {
                        lockB.unlock();
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "Thread-2").start();
    }
}
```

### 2.3 读写锁 ReentrantReadWriteLock

```java
public class ReadWriteLockDemo {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();   // 共享锁
    private final Lock writeLock = rwLock.writeLock(); // 独占锁
    private int value = 0;

    // 读操作 - 多个线程可同时读
    public int read() {
        readLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " 正在读取: " + value);
            return value;
        } finally {
            readLock.unlock();
        }
    }

    // 写操作 - 同一时间只能有一个线程写
    public void write(int newValue) {
        writeLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " 正在写入: " + newValue);
            value = newValue;
        } finally {
            writeLock.unlock();
        }
    }

    // 锁降级：写锁 -> 读锁
    public void writeThenRead() {
        writeLock.lock();
        try {
            value = 100; // 先写
            readLock.lock(); // 获取读锁
            try {
                System.out.println("锁降级后读取: " + value);
            } finally {
                readLock.unlock();
            }
        } finally {
            writeLock.unlock(); // 最后释放写锁
        }
    }

    public static void main(String[] args) {
        ReadWriteLockDemo demo = new ReadWriteLockDemo();

        // 5个线程并发读
        for (int i = 0; i < 5; i++) {
            new Thread(demo::read, "Reader-" + i).start();
        }

        // 2个线程写
        for (int i = 0; i < 2; i++) {
            final int v = i * 10;
            new Thread(() -> demo.write(v), "Writer-" + i).start();
        }
    }
}
```

---

## 三、线程间通信

### 3.1 wait/notify

#### 两个线程交替打印

```java
public class AlternatePrint {
    private int num = 1;
    private final Object lock = new Object();

    public static void main(String[] args) {
        AlternatePrint demo = new AlternatePrint();

        new Thread(() -> demo.printOdd(), "Odd").start();
        new Thread(() -> demo.printEven(), "Even").start();
    }

    public void printOdd() {
        synchronized (lock) {
            while (num <= 10) {
                if (num % 2 == 1) {
                    System.out.println(Thread.currentThread().getName() + ": " + num++);
                    lock.notify(); // 唤醒另一个线程
                    try {
                        if (num <= 10) lock.wait(); // 释放锁并等待
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    try {
                        lock.wait(); // 不是自己的回合，等待
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
    }

    public void printEven() {
        synchronized (lock) {
            while (num <= 10) {
                if (num % 2 == 0) {
                    System.out.println(Thread.currentThread().getName() + ": " + num++);
                    lock.notify();
                    try {
                        if (num <= 10) lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
    }
}
```

#### 生产者消费者（wait/notify 实现）

```java
public class ProducerConsumer {
    private final LinkedList<Integer> buffer = new LinkedList<>();
    private final int capacity = 5;

    public static void main(String[] args) {
        ProducerConsumer pc = new ProducerConsumer();

        new Thread(pc::produce, "Producer").start();
        new Thread(pc::consume, "Consumer").start();
    }

    public void produce() {
        int value = 0;
        while (true) {
            synchronized (buffer) {
                while (buffer.size() == capacity) { // 队列满，等待
                    try {
                        System.out.println("队列已满，生产者等待...");
                        buffer.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                }
                buffer.add(value);
                System.out.println("生产: " + value++);
                buffer.notifyAll(); // 唤醒消费者
            }
            try { Thread.sleep(500); } catch (InterruptedException e) {}
        }
    }

    public void consume() {
        while (true) {
            synchronized (buffer) {
                while (buffer.isEmpty()) { // 队列空，等待
                    try {
                        System.out.println("队列已空，消费者等待...");
                        buffer.wait();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                }
                int value = buffer.removeFirst();
                System.out.println("消费: " + value);
                buffer.notifyAll(); // 唤醒生产者
            }
            try { Thread.sleep(800); } catch (InterruptedException e) {}
        }
    }
}
```

### 3.2 Condition

#### 基本使用（对应关系）

| Object 方法    | Condition 方法 | 说明         |
|----------------|----------------|--------------|
| `wait()`       | `await()`      | 释放锁并等待 |
| `notify()`     | `signal()`     | 唤醒一个线程 |
| `notifyAll()`  | `signalAll()`  | 唤醒所有线程 |

#### 三个线程顺序输出 ABC（Condition 精准通知）

```java
public class ConditionABC {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition conditionA = lock.newCondition();
    private final Condition conditionB = lock.newCondition();
    private final Condition conditionC = lock.newCondition();

    private int flag = 1; // 1->A, 2->B, 3->C

    public static void main(String[] args) {
        ConditionABC demo = new ConditionABC();

        new Thread(() -> demo.printA(), "Thread-A").start();
        new Thread(() -> demo.printB(), "Thread-B").start();
        new Thread(() -> demo.printC(), "Thread-C").start();
    }

    public void printA() {
        lock.lock();
        try {
            for (int i = 0; i < 5; i++) {
                while (flag != 1) { // 不是 A 的回合，等待
                    conditionA.await();
                }
                System.out.print("A");
                flag = 2;
                conditionB.signal(); // 精准唤醒 B
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();
        }
    }

    public void printB() {
        lock.lock();
        try {
            for (int i = 0; i < 5; i++) {
                while (flag != 2) {
                    conditionB.await();
                }
                System.out.print("B");
                flag = 3;
                conditionC.signal(); // 精准唤醒 C
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();
        }
    }

    public void printC() {
        lock.lock();
        try {
            for (int i = 0; i < 5; i++) {
                while (flag != 3) {
                    conditionC.await();
                }
                System.out.print("C");
                flag = 1;
                conditionA.signal(); // 精准唤醒 A
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            lock.unlock();
        }
    }
}
// 输出: ABCABCABCABCABC
```

#### Condition 实现生产者消费者（精准唤醒）

```java
public class ProducerConsumerCondition {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();  // 生产者等待队列
    private final Condition notEmpty = lock.newCondition(); // 消费者等待队列

    private final LinkedList<Integer> buffer = new LinkedList<>();
    private final int capacity = 5;

    public static void main(String[] args) {
        ProducerConsumerCondition pc = new ProducerConsumerCondition();

        new Thread(pc::produce, "Producer").start();
        new Thread(pc::consume, "Consumer").start();
    }

    public void produce() {
        int value = 0;
        while (true) {
            lock.lock();
            try {
                while (buffer.size() == capacity) {
                    System.out.println("队列已满，生产者等待...");
                    notFull.await(); // 生产者进入 notFull 队列等待
                }
                buffer.add(value);
                System.out.println("生产: " + value++);
                notEmpty.signal(); // 只唤醒消费者，不唤醒其他生产者
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } finally {
                lock.unlock();
            }
            try { Thread.sleep(500); } catch (InterruptedException e) {}
        }
    }

    public void consume() {
        while (true) {
            lock.lock();
            try {
                while (buffer.isEmpty()) {
                    System.out.println("队列已空，消费者等待...");
                    notEmpty.await(); // 消费者进入 notEmpty 队列等待
                }
                int value = buffer.removeFirst();
                System.out.println("消费: " + value);
                notFull.signal(); // 只唤醒生产者
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } finally {
                lock.unlock();
            }
            try { Thread.sleep(800); } catch (InterruptedException e) {}
        }
    }
}
```

**Condition 相比 wait/notify 的优势：**
- 支持多个等待队列，可以精准唤醒指定类型的线程
- 生产者唤醒消费者，消费者唤醒生产者，避免无效唤醒

---

## 四、线程池

### 4.1 ThreadPoolExecutor 基本使用

```java
// 代码示例待补充
```

### 4.2 线程池参数配置实践

```java
// 代码示例待补充
```

---

## 五、并发工具类

### 5.1 CountDownLatch

```java
// 代码示例待补充
```

### 5.2 CyclicBarrier

```java
// 代码示例待补充
```

### 5.3 Semaphore

```java
// 代码示例待补充
```

---

## 六、并发容器

### 6.1 ConcurrentHashMap

```java
// 代码示例待补充
```

### 6.2 CopyOnWriteArrayList

```java
// 代码示例待补充
```

### 6.3 BlockingQueue

```java
// 代码示例待补充
```

---

## 七、异步编程

### 7.1 CompletableFuture 基本使用

```java
// 代码示例待补充
```

### 7.2 多任务组合

```java
// 代码示例待补充
```

---

## 八、原子类

### 8.1 AtomicInteger

```java
// 代码示例待补充
```
