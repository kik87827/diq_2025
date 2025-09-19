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

/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            this.popupHide(this.selector);
          },
          false
        );
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      if ("openCallback" in instance_option) {
        instance_option.openCallback();
      }
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    this.layer_wrap_parent.append(this.selector);
    popupEventFunc();
    this.dimCheck();
  }
  popupHide(option) {
    let target = this.option.selector;
    let instance_option = option || {};
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      if ("beforeClose" in instance_option) {
        instance_option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
        let closeTimer = 0;
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = 0;
        } else {
          if ("closeCallback" in this.option) {
            this.option.closeCallback();
          }
          closeTimer = setTimeout(() => {
            if ("closeCallback" in instance_option) {
              instance_option.closeCallback();
            }
          }, 30);
        }
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();

      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}

function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? "확인";
  let cancelTextNode = option.cancelText ?? "취소";
  let closeBtnDisplay = option.closeDisplay ?? true;
  let submitBtnDisplay = option.submitDisplay ?? true;
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="javascript:;" class="btn_submit_box modal_submit cancelcall"><span class="btn_submit_box_text">${cancelTextNode}</span></a>
    <a href="javascript:;" class="btn_submit_box modal_submit primary okcall"><span class="btn_submit_box_text">${okTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="javascript:;" class="btn_submit_box primary okcall"><span class="btn_submit_box_text">${okTextNode}</span></a>
    `;
  }

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                  <div class="modal_card_contents">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_bottom_wrap btn_modal_submit_wrap">
                        ${btnHTML}
                    </div>
                    <a href="javascript:;" class="btn_modal_close"></a>
                  </div>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) {
    clearTimeout(showNum);
  }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit_wrap = modal_item.querySelector(".btn_modal_submit_wrap");
  let btn_modal_submit = modal_item.querySelectorAll(".modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if (!submitBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("submit_not");
  }
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;

      if (!submitBtnDisplay) {
        item.remove();
        btn_modal_submit_wrap.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          let thisTarget = e.currentTarget;
          closeAction();
          if (thisTarget.classList.contains("okcall")) {
            if (option.okcallback) {
              option.okcallback();
            }
          } else if (thisTarget.classList.contains("cancelcall")) {
            if (option.cancelcallback) {
              option.cancelcallback();
            }
          }
          eventIs = true;
        });
      }
    });
  }
  if (!closeBtnDisplay) {
    modal_item.querySelector(".modal_box_item").classList.add("close_not");
  }
  if (!!btn_modal_close) {
    btn_modal_close.forEach((item) => {
      let eventIs = false;
      if (!closeBtnDisplay) {
        item.remove();
      } else {
        if (eventIs) {
          item.removeEventListener("click");
        }
        item.addEventListener("click", (e) => {
          closeAction();
          eventIs = true;
        });
      }
    });
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) {
      clearTimeout(actionNum);
    }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}

/* max min */
function maxWidth(option) {
  const targets = Array.isArray(option.target) ? option.target : [option.target];
  const mobileOnly = option.mobileOnly || false;

  action();
  $(window).on("resize", action);

  function action() {
    targets.forEach((sel) => {
      const $target = $(sel);
      let maxWidth = [];

      $target.css({ width: "" });
      $target.each(function () {
        maxWidth.push(this.getBoundingClientRect().width); // 소수점까지
      });

      if (mobileOnly) {
        if ($(window).width() < 1023) {
          $target.css({ width: Math.max.apply(null, maxWidth) });
        }
      } else {
        $target.css({ width: Math.max.apply(null, maxWidth) });
      }
    });
  }
}

/* combo box */
function comboFunc() {
  const $combo_item = $(".combo_item");
  const $combo_option_group = $(".combo_option_group");
  const $appBody = $(".page_wrap");

  // combo_target 클릭
  $(document).on("click", ".combo_target", function (e) {
    const $thisTarget = $(this);
    const $thisParent = $thisTarget.closest(".combo_item");
    const $thisOptionGroup = $thisParent.find(".combo_option_group");
    let $appendOption = null;
    let $combo_option_scroll = null;

    if ($thisOptionGroup.length) {
      comboInit();
    }
    comboPosAction();

    // 다른 combo_item 초기화
    $combo_item.not($thisParent).removeClass("active");

    // $thisTarget.css("width", $thisTarget[0].getBoundingClientRect().width + "px");

    $appendOption = $(`[data-option='${$thisParent.attr("id")}']`);
    $combo_option_scroll = $appendOption.find(".combo_option_scroll");

    let combo_option_list_count = $combo_option_scroll.attr("data-rowCount") !== undefined ? $combo_option_scroll.attr("data-rowCount") : 5;

    $combo_option_group.not($appendOption).removeClass("active");

    $thisParent.toggleClass("active");
    $appendOption.toggleClass("active");

    if ($appendOption.hasClass("active")) {
      /* if ($combo_option_scroll.hasClass("addHeight")) {
        return;
      } */
      let $li = $appendOption.find("li").eq(combo_option_list_count);
      if ($li.length) {
        $combo_option_scroll.css("max-height", $li.position().top + "px");
      }
      $combo_option_scroll.addClass("addHeight");
    }
  });

  // combo_option 클릭
  $(document).on("click", ".combo_option", function (e) {
    const $thisTarget = $(this);
    const $thisParent = $thisTarget.closest(".combo_option_group");
    const thisTargetText = $thisTarget.text();
    const $comboCallItem = $(`#${$thisParent.data("option")}`);
    const $comboCallTarget = $comboCallItem.find(".combo_target");

    if ($thisTarget.hasClass("disabled")) {
      return;
    }

    $comboCallTarget.children(".text_node").text(thisTargetText);
    $thisParent.removeClass("active");
    $comboCallItem.removeClass("active");
  });

  // 바깥 클릭 시 닫기
  $(document).on("click", function (e) {
    if ($(e.target).closest(".combo_item").length) {
      return;
    }
    comboReset();
  });

  // 리사이즈
  let currentWid = $(window).width();
  $(window).on("resize", function () {
    if (currentWid !== $(window).width()) {
      comboPosAction();
    }
    currentWid = $(window).width();
  });

  // Reset 함수
  function comboReset() {
    $(".combo_item").removeClass("active");
    $(".combo_option_group").removeClass("active");
  }

  // Init 함수
  function comboInit() {
    $(".combo_item").each(function (index) {
      const $thisElement = $(this);
      const $option_group = $thisElement.find(".combo_option_group");

      if (!$thisElement.attr("id")) {
        $thisElement.attr("id", "combo_item_" + index);
        $option_group.attr("data-option", "combo_item_" + index);
      } else {
        $option_group.attr("data-option", $thisElement.attr("id"));
      }

      if ($thisElement.closest(".popup_card_contents").length) {
        $thisElement.closest(".popup_card_contents").append($option_group);
      } else {
        $appBody.append($option_group);
      }
    });
  }

  // 위치 조정 함수
  function comboPosAction() {
    $(".combo_option_group").each(function () {
      const $element = $(this);
      const $comboCall = $("#" + $element.data("option"));
      if (!$comboCall.length) return;

      const comboOffset = $comboCall.offset();
      const comboRect = $comboCall[0].getBoundingClientRect();
      const comboHeight = comboRect.height;

      if ($comboCall.closest(".popup_card_contents").length) {
        const $fullpop = $comboCall.closest(".popup_card_contents");
        const fullpopOffset = $fullpop.offset();

        $element.attr(
          "style",
          `
          top:${comboOffset.top - fullpopOffset.top + comboHeight - 1}px;
          left:${comboOffset.left - fullpopOffset.left}px;
          width:${comboRect.width}px;
        `
        );
      } else {
        $element.attr(
          "style",
          `
          top:${comboOffset.top + comboHeight - 1}px;
          left:${comboOffset.left}px;
          width:${comboRect.width}px;
        `
        );
      }
    });
  }
}

// 값 변경 콜백
function comboChangeCallback(option) {
  $(document).on("click", `[data-option='${option.target}'] .combo_option`, function (e) {
    const $this = $(this);
    const value = $this.data("value");
    if (typeof option.callback === "function") {
      option.callback(value);
    }
  });
}

function responWidFunc() {
  const responDom = $("[data-pcwid]");
  const responMbDom = $("[data-mbwid]");
  action();
  $(window).on("resize", function () {
    action();
  });

  function action() {
    responMbDom.css("width", "");
    responDom.css("width", "");
    if ($(window).width() > 1023) {
      responDom.each(function () {
        const $this = $(this);
        if ($this.attr("data-pconly") === "true") {
          if ($(window).width() > 1440) {
            $this.css("width", $this.attr("data-pcwid"));
          }
          return;
        }
        $this.css("width", $this.attr("data-pcwid"));
      });
    } else {
      responMbDom.each(function () {
        const $this = $(this);
        $this.css("width", $this.attr("data-mbwid"));
      });
    }
  }
}

function followWidth() {
  const syncTarget = $("[data-syncTarget]");

  action();
  $(window).on("resize", function () {
    action();
  });

  function action() {
    syncTarget.css("width", "");
    if ($(window).width() > 1023) {
      syncTarget.each(function () {
        const $this = $(this);
        const $thisSync = $("[data-syncStandard='" + $this.attr("data-syncTarget") + "']");
        $this.css("width", $thisSync[0].getBoundingClientRect().width);
      });
    }
  }
}
