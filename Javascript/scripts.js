$(document).ready(function () {
  // Initialize dropdowns
  $(".dropdown-toggle").click(function (e) {
    e.preventDefault();
    const $dropdownMenu = $(this).closest(".nav-item").find(".dropdown-menu");
    $(".dropdown-menu").not($dropdownMenu).hide();
    $dropdownMenu.toggle();
  });

  // Close dropdowns when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".nav-item").length) {
      $(".dropdown-menu").hide();
    }
  });

  // Table actions dropdown
  $(".table-action-button").click(function (e) {
    e.stopPropagation();
    $("#tableActionDropdown").toggle();
  });

  // Close table actions dropdown when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".table-actions").length) {
      $("#tableActionDropdown").hide();
    }
  });

  // Run Query modal
  $('.action-item:contains("Run a Query")').click(function () {
    $("#queryModal").show();
  });

  // Close modal when clicking on close button or outside
  $(".modal-close").click(function () {
    $(this).closest(".modal").hide();
  });

  $(window).click(function (e) {
    if ($(e.target).hasClass("modal")) {
      $(".modal").hide();
    }
  });

  // Competency Manager
  $('.sidebar-item[data-item="competency"]').click(function () {
    $("#competencyModal").show();
  });

  // Table row hover effect
  $(".data-table tbody tr").hover(
    function () {
      $(this).css("background-color", "rgba(0, 0, 0, 0.05)");
    },
    function () {
      $(this).css("background-color", "");
    }
  );

  // Table search functionality
  $(".table-search").on("input", function () {
    const searchText = $(this).val().toLowerCase();
    $(".data-table tbody tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchText));
    });
  });

  // Rows per page functionality
  $(".rows-select").change(function () {
    const rowsPerPage = parseInt($(this).val());
    const totalRows = $(".data-table tbody tr").length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Update pagination info
    updatePagination(1, rowsPerPage, totalRows);

    // Show only first page rows
    $(".data-table tbody tr").hide().slice(0, rowsPerPage).show();
  });

  // Pagination navigation
  $(".pagination-button").click(function () {
    const isNext = $(this).hasClass("next-button");
    const rowsPerPage = parseInt($(".rows-select").val());
    const totalRows = $(".data-table tbody tr").length;
    const currentPage = getCurrentPage();
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    let newPage = isNext ? currentPage + 1 : currentPage - 1;

    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;

    if (newPage !== currentPage) {
      updatePagination(newPage, rowsPerPage, totalRows);
      showPage(newPage, rowsPerPage);
    }
  });

  // Query form submission
  $(".run-query-btn").click(function () {
    const column = $(".column-select").val();
    const operator = $(".operator-select").val();
    const value = $(".value-input").val().toLowerCase();

    $(".data-table tbody tr").each(function () {
      const cellText = $(this).find(`td.${column}-cell`).text().toLowerCase();
      let show = false;

      switch (operator) {
        case "contains":
          show = cellText.includes(value);
          break;
        case "equals":
          show = cellText === value;
          break;
        case "starts-with":
          show = cellText.startsWith(value);
          break;
        case "ends-with":
          show = cellText.endsWith(value);
          break;
      }

      $(this).toggle(show);
    });

    $("#queryModal").hide();
  });

  // Helper functions
  function getCurrentPage() {
    const range = $(".pagination-range").text();
    return parseInt(range.split("-")[0]);
  }

  function updatePagination(page, rowsPerPage, totalRows) {
    const start = (page - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, totalRows);
    $(".pagination-range").text(`${start}-${end} of ${totalRows}`);
  }

  function showPage(page, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    $(".data-table tbody tr").hide().slice(start, end).show();
  }

  // Export functionality
  $('.action-item:contains("Export")').click(function () {
    const format = $(this).text().split("Export table to ")[1].toLowerCase();
    exportTable(format);
  });

  function exportTable(format) {
    let content = "";
    const headers = [];

    // Get headers
    $(".data-table th").each(function () {
      headers.push($(this).text());
    });

    // Get visible rows
    const rows = [];
    $(".data-table tbody tr:visible").each(function () {
      const row = [];
      $(this)
        .find("td")
        .each(function () {
          row.push($(this).text().trim());
        });
      rows.push(row);
    });

    switch (format) {
      case "excel":
        content = headers.join("\t") + "\n";
        rows.forEach((row) => {
          content += row.join("\t") + "\n";
        });
        downloadFile("table_export.xls", content);
        break;

      case "word":
        content = '<table border="1">';
        content +=
          "<tr>" + headers.map((h) => `<th>${h}</th>`).join("") + "</tr>";
        rows.forEach((row) => {
          content +=
            "<tr>" + row.map((cell) => `<td>${cell}</td>`).join("") + "</tr>";
        });
        content += "</table>";
        downloadFile("table_export.doc", content);
        break;

      case "text":
        content = headers.join(",") + "\n";
        rows.forEach((row) => {
          content += row.join(",") + "\n";
        });
        downloadFile("table_export.txt", content);
        break;
    }
  }

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Sidebar Toggle
  $(".sidebar-toggle").click(function () {
    $(".sidebar").toggleClass("collapsed");
    $(this).find("i").toggleClass("fa-angle-left fa-angle-right");
  });

  // Supervisor Dropdown
  $(".supervisor-dropdown .dropdown-toggle").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".supervisor-menu").toggleClass("active");
  });

  // Close supervisor dropdown when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".supervisor-dropdown").length) {
      $(".supervisor-menu").removeClass("active");
    }
  });

  // Table row actions
  $(".options-icon").click(function (e) {
    e.stopPropagation();
    const $dropdown = $(this).closest("td").find(".table-actions-dropdown");
    $(".table-actions-dropdown").not($dropdown).removeClass("active");
    $dropdown.toggleClass("active");
  });

  // Close table actions dropdown when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".options-icon").length) {
      $(".table-actions-dropdown").removeClass("active");
    }
  });

  // Query Modal for Competency Manager
  $(".open-competency-manager").click(function () {
    $("#competencyModal").show();
    // Pre-populate the form if needed
    $("#competencyModal .column-select").val("category");
    $("#competencyModal .operator-select").val("contains");
  });

  // Run Query button in Competency Manager
  $("#competencyModal .btn-run-query").click(function () {
    const column = $("#competencyModal .column-select").val();
    const operator = $("#competencyModal .operator-select").val();
    const value = $("#competencyModal .value-input").val().toLowerCase();

    // Perform the query (similar to existing query logic)
    filterTableData(column, operator, value);
    $("#competencyModal").hide();
  });

  // Helper function for filtering table data
  function filterTableData(column, operator, value) {
    $(".data-table tbody tr").each(function () {
      const cellText = $(this).find(`td.${column}-cell`).text().toLowerCase();
      let show = false;

      switch (operator) {
        case "contains":
          show = cellText.includes(value);
          break;
        case "equals":
          show = cellText === value;
          break;
        case "starts-with":
          show = cellText.startsWith(value);
          break;
        case "ends-with":
          show = cellText.endsWith(value);
          break;
      }

      $(this).toggle(show);
    });
  }

  // Mobile sidebar toggle
  let touchStartX = 0;
  let touchEndX = 0;

  // Handle touch events for sidebar swipe
  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  document.addEventListener(
    "touchend",
    function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe right - show sidebar
        $(".sidebar").addClass("active");
      } else {
        // Swipe left - hide sidebar
        $(".sidebar").removeClass("active");
      }
    }
  }

  // Handle window resize
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Reset sidebar state on larger screens
      if ($(window).width() > 768) {
        $(".sidebar").removeClass("active");
      }

      // Reposition any open dropdowns
      $(".table-actions-dropdown:visible").each(function () {
        const $dropdown = $(this);
        const $button = $dropdown
          .closest(".table-actions")
          .find(".table-action-button");
        const buttonOffset = $button.offset();
        const dropdownWidth = $dropdown.outerWidth();
        const windowWidth = $(window).width();

        if (buttonOffset.left + dropdownWidth > windowWidth) {
          $dropdown.css({
            right: "0",
            left: "auto",
          });
        } else {
          $dropdown.css({
            left: "0",
            right: "auto",
          });
        }
      });
    }, 250);
  });
});
