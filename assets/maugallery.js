(function($) {

  // Declaration of the jQuery plugin mauGallery
  $.fn.mauGallery = function(options) {
    // Merging default options with user-provided options
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {

      // Creating the container for gallery items
      $.fn.mauGallery.methods.createRowWrapper($(this));
      // Creating the lightbox if the option is enabled
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }

      // Adding event listeners
      $.fn.mauGallery.listeners(options);

      // Initializing each gallery item
      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this)); // Make the image responsive
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this)); // Move the item into the container
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns); // Wrap the item in a column

          // Collecting tags
          var theTag = $(this).data("gallery-tag");
          if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
             tagsCollection.push(theTag);
          }

        });

      // Displaying tags if the option is enabled
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
      }

      // Displaying the gallery with a fade-in animation
      $(this).fadeIn(500);
    });
  };

  // Default options for the plugin
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  // Adding event listeners
  $.fn.mauGallery.listeners = function(options) {
    // Listener for opening the lightbox
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    // Listener for filtering by tag
    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

    // Listeners for navigation in the lightbox
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );

    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  // Plugin methods
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      // Create a container for gallery items if it does not exist
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      // Wrap a gallery item in a Bootstrap grid column
      if (columns.constructor === Number) {
        element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`);
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
      }
    },
    moveItemInRowWrapper(element) {
      // Move an item into the gallery container
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      // Add a class to make images responsive
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      // Open the lightbox with the selected image
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage(lightboxId) {
      // Show the previous image in the lightbox
      let activeImageSrc = $(`#${lightboxId}`).find(".lightboxImage").attr("src");
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".gallery-item").each(function() {
          imagesCollection.push($(this));
        });
      } else {
        $(".gallery-item").each(function() {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }
      let currentIndex = imagesCollection.findIndex(image => image.attr("src") === activeImageSrc);
      let prevIndex = (currentIndex - 1 + imagesCollection.length) % imagesCollection.length;
      $(`#${lightboxId}`).find(".lightboxImage").attr("src", imagesCollection[prevIndex].attr("src"));
    },
    nextImage(lightboxId) {
      // Show the next image in the lightbox
      let activeImageSrc = $(`#${lightboxId}`).find(".lightboxImage").attr("src");
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".gallery-item").each(function() {
          imagesCollection.push($(this));
        });
      } else {
        $(".gallery-item").each(function() {
          if ($(this).data("gallery-tag") === activeTag) {
            imagesCollection.push($(this));
          }
        });
      }
      let currentIndex = imagesCollection.findIndex(image => image.attr("src") === activeImageSrc);
      let nextIndex = (currentIndex + 1) % imagesCollection.length;
      $(`#${lightboxId}`).find(".lightboxImage").attr("src", imagesCollection[nextIndex].attr("src"));
    },
    createLightBox(gallery, lightboxId, navigation) {
      // Create the HTML structure of the lightbox
      gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
      }" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                              navigation
                                ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="Content of the image displayed in the modal on click"/>
                            ${
                              navigation
                                ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
    },
    showItemTags(gallery, position, tags) {
      // Display filtering tags based on their position
      var tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">All</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item">
                <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }

      // Adding event listeners for tags
      gallery.find('.nav-link').on('click', function() {
        if (!$(this).hasClass('active-tag')) {
          gallery.find('.active-tag').removeClass('active active-tag');
          $(this).addClass('active active-tag');
        }

        // Logic for filtering gallery items
        var tag = $(this).data('images-toggle');
        gallery.find('.gallery-item').each(function() {
          var $item = $(this).parents('.item-column');
          if (tag === 'all') {
            $item.show(300);
          } else if ($(this).data('gallery-tag') === tag) {
            $item.show(300);
          } else {
            $item.hide(300);
          }
        });
      });

      // Adding events to change the cursor on hover
      gallery.find('.nav-link').on('mouseenter', function() {
        $(this).css('cursor', 'pointer'); // Change cursor to a pointer on hover
      }).on('mouseleave', function() {
        $(this).css('cursor', ''); // Revert to default cursor on mouse leave
      });
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
  
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active-tag");
      var tag = $(this).data("images-toggle");
      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide();
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);
