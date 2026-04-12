document$.subscribe(function () {
  // 跟随 MkDocs Material 的深浅色模式
  var palette = localStorage.getItem("__palette");
  var theme = "default";
  if (palette) {
    try {
      var obj = JSON.parse(palette);
      if (obj && obj.color && obj.color.scheme === "slate") {
        theme = "dark";
      }
    } catch (e) {}
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: theme,
    securityLevel: "loose",
  });

  mermaid.init(undefined, document.querySelectorAll(".mermaid"));
});
