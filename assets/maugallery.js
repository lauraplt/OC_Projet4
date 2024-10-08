!(function (a) {
  (a.fn.mauGallery = function (t) {
    var t = a.extend(a.fn.mauGallery.defaults, t),
      e = [];
    return this.each(function () {
      a.fn.mauGallery.methods.createRowWrapper(a(this)),
        t.lightBox &&
          a.fn.mauGallery.methods.createLightBox(
            a(this),
            t.lightboxId,
            t.navigation
          ),
        a.fn.mauGallery.listeners(t),
        a(this)
          .children(".gallery-item")
          .each(function (l) {
            a.fn.mauGallery.methods.responsiveImageItem(a(this)),
              a.fn.mauGallery.methods.moveItemInRowWrapper(a(this)),
              a.fn.mauGallery.methods.wrapItemInColumn(a(this), t.columns);
            var i = a(this).data("gallery-tag");
            t.showTags && void 0 !== i && -1 === e.indexOf(i) && e.push(i);
          }),
        t.showTags &&
          a.fn.mauGallery.methods.showItemTags(a(this), t.tagsPosition, e),
        a(this).fadeIn(500);
    });
  }),
    (a.fn.mauGallery.defaults = {
      columns: 3,
      lightBox: !0,
      lightboxId: null,
      showTags: !0,
      tagsPosition: "bottom",
      navigation: !0,
    }),
    (a.fn.mauGallery.listeners = function (t) {
      a(".gallery-item").on("click", function () {
        t.lightBox &&
          "IMG" === a(this).prop("tagName") &&
          a.fn.mauGallery.methods.openLightBox(a(this), t.lightboxId);
      }),
        a(".gallery").on(
          "click",
          ".nav-link",
          a.fn.mauGallery.methods.filterByTag
        ),
        a(".gallery").on("click", ".mg-prev", () =>
          a.fn.mauGallery.methods.prevImage(t.lightboxId)
        ),
        a(".gallery").on("click", ".mg-next", () =>
          a.fn.mauGallery.methods.nextImage(t.lightboxId)
        );
    }),
    (a.fn.mauGallery.methods = {
      createRowWrapper(a) {
        a.children().first().hasClass("row") ||
          a.append('<div class="gallery-items-row row"></div>');
      },
      wrapItemInColumn(a, t) {
        if (t.constructor === Number)
          a.wrap(
            `<div class='item-column mb-4 col-${Math.ceil(12 / t)}'></div>`
          );
        else if (t.constructor === Object) {
          var e = "";
          t.xs && (e += ` col-${Math.ceil(12 / t.xs)}`),
            t.sm && (e += ` col-sm-${Math.ceil(12 / t.sm)}`),
            t.md && (e += ` col-md-${Math.ceil(12 / t.md)}`),
            t.lg && (e += ` col-lg-${Math.ceil(12 / t.lg)}`),
            t.xl && (e += ` col-xl-${Math.ceil(12 / t.xl)}`),
            a.wrap(`<div class='item-column mb-4${e}'></div>`);
        } else
          console.error(
            `Columns should be defined as numbers or objects. ${typeof t} is not supported.`
          );
      },
      moveItemInRowWrapper(a) {
        a.appendTo(".gallery-items-row");
      },
      responsiveImageItem(a) {
        "IMG" === a.prop("tagName") && a.addClass("img-fluid");
      },
      openLightBox(t, e) {
        a(`#${e}`).find(".lightboxImage").attr("src", t.attr("src")),
          a(`#${e}`).modal('show');
      },
      prevImage(t) {
        let e = a(`#${t}`).find(".lightboxImage").attr("src"),
          l = a(".tags-bar span.active-tag").data("images-toggle"),
          i = [];
        "all" === l
          ? a(".gallery-item").each(function () {
              i.push(a(this));
            })
          : a(".gallery-item").each(function () {
              a(this).data("gallery-tag") === l && i.push(a(this));
            });
        let s =
          (i.findIndex((a) => a.attr("src") === e) - 1 + i.length) % i.length;
        a(`#${t}`).find(".lightboxImage").attr("src", i[s].attr("src"));
      },
      nextImage(t) {
        let e = a(`#${t}`).find(".lightboxImage").attr("src"),
          l = a(".tags-bar span.active-tag").data("images-toggle"),
          i = [];
        "all" === l
          ? a(".gallery-item").each(function () {
              i.push(a(this));
            })
          : a(".gallery-item").each(function () {
              a(this).data("gallery-tag") === l && i.push(a(this));
            });
        let s = (i.findIndex((a) => a.attr("src") === e) + 1) % i.length;
        a(`#${t}`).find(".lightboxImage").attr("src", i[s].attr("src"));
      },
      createLightBox(a, t, e) {
        a.append(`<div class="modal fade" id="${
          t || "galleryLightbox"
        }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              e
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Content of the image displayed in the modal on click"/>
                            ${
                              e
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
      },
      showItemTags(t, e, l) {
        var i =
          '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">All</span></li>';
        a.each(l, function (a, t) {
          i += `<li class="nav-item">
                <span class="nav-link" data-images-toggle="${t}">${t}</span></li>`;
        });
        var s = `<ul class="my-4 tags-bar nav nav-pills">${i}</ul>`;
        "bottom" === e
          ? t.append(s)
          : "top" === e
          ? t.prepend(s)
          : console.error(`Unknown tags position: ${e}`),
          t.find(".nav-link").on("click", function () {
            a(this).hasClass("active-tag") ||
              (t.find(".active-tag").removeClass("active active-tag"),
              a(this).addClass("active active-tag"));
            var e = a(this).data("images-toggle");
            t.find(".gallery-item").each(function () {
              var t = a(this).parents(".item-column");
              "all" === e
                ? t.show(300)
                : a(this).data("gallery-tag") === e
                ? t.show(300)
                : t.hide(300);
            });
          }),
          t
            .find(".nav-link")
            .on("mouseenter", function () {
              a(this).css("cursor", "pointer");
            })
            .on("mouseleave", function () {
              a(this).css("cursor", "");
            });
      },
      filterByTag() {
        if (!a(this).hasClass("active-tag")) {
          a(".active-tag").removeClass("active active-tag"),
            a(this).addClass("active-tag");
          var t = a(this).data("images-toggle");
          a(".gallery-item").each(function () {
            a(this).parents(".item-column").hide(),
              "all" === t
                ? a(this).parents(".item-column").show(300)
                : a(this).data("gallery-tag") === t &&
                  a(this).parents(".item-column").show(300);
          });
        }
      },
    });
})(jQuery);
