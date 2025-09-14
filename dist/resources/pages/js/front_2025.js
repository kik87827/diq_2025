$(function () {
  layoutFunc();
});

function layoutFunc() {
  const btn_mb_total = $(".btn_mb_total");
  const header_mobile_container = $(".header_mobile_container");

  btn_mb_total.on("click", function () {
    openFunc();
  });
  header_mobile_container.on("click", function (e) {
    if (!$(e.target).closest(".header_mobile_panel").length) {
      closeFunc();
    }
  });
  windowCheck();
  $(window).on("resize", function () {
    windowCheck();
  });

  function openFunc() {
    let set_timer = 0;
    header_mobile_container.addClass("active");
    $("html,body").addClass("touchDis2");
    if (set_timer) {
      clearTimeout(set_timer);
    }
    set_timer = setTimeout(() => {
      header_mobile_container.addClass("motion");
    }, 40);
  }

  function closeFunc() {
    let set_timer = 0;
    header_mobile_container.removeClass("motion");
    $("html,body").removeClass("touchDis2");
    if (set_timer) {
      clearTimeout(set_timer);
    }
    set_timer = setTimeout(() => {
      header_mobile_container.removeClass("active");
    }, 520);
  }

  function windowCheck() {
    if ($(window).width() > 1023) {
      closeFunc();
    }
  }
}
