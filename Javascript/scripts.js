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
    $("#queryModal").show();
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

    updatePagination(1, rowsPerPage, totalRows);
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

  // Updated Sidebar Toggle
  $(".sidebar-toggle").click(function (e) {
    e.stopPropagation();
    const $sidebar = $(".sidebar");
    const isMobile = $(window).width() <= 768;

    if (isMobile) {
      $sidebar.toggleClass("active");
    } else {
      $sidebar.toggleClass("collapsed");
    }

    // Update toggle button icon
    const $icon = $(this).find("i");
    if ($sidebar.hasClass("collapsed") || $sidebar.hasClass("active")) {
      $icon.removeClass("fa-angle-left").addClass("fa-angle-right");
    } else {
      $icon.removeClass("fa-angle-right").addClass("fa-angle-left");
    }
  });

  // Close sidebar when clicking outside on mobile
  $(document).click(function (e) {
    if ($(window).width() <= 768) {
      if (
        !$(e.target).closest(".sidebar").length &&
        !$(e.target).closest(".sidebar-toggle").length
      ) {
        $(".sidebar").removeClass("active");
      }
    }
  });

  // Handle window resize
  let resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const isMobile = $(window).width() <= 768;
      const $sidebar = $(".sidebar");
      const $icon = $(".sidebar-toggle i");

      if (!isMobile) {
        $sidebar.removeClass("active");
        if ($sidebar.hasClass("collapsed")) {
          $icon.removeClass("fa-angle-left").addClass("fa-angle-right");
        } else {
          $icon.removeClass("fa-angle-right").addClass("fa-angle-left");
        }
      } else {
        $sidebar.removeClass("collapsed");
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
    $("#queryModal").show();
    // Pre-populate the form if needed
    $("#queryModal .column-select").val("category");
    $("#queryModal .operator-select").val("contains");
  });

  // Run Query button in Competency Manager
  $("#queryModal .btn-run-query").click(function () {
    const column = $("#queryModal .column-select").val();
    const operator = $("#queryModal .operator-select").val();
    const value = $("#queryModal .value-input").val().toLowerCase();

    filterTableData(column, operator, value);
    $("#queryModal").hide();
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
        $(".sidebar").addClass("active");
      } else {
        $(".sidebar").removeClass("active");
      }
    }
  }

  // Top navigation search toggle
  $(".nav-search .search-icon-button").click(function (e) {
    e.stopPropagation();
    const $container = $(".nav-search-input-container");
    $container.toggleClass("active");

    if ($container.hasClass("active")) {
      $container.find(".nav-search-input").focus();
    }
  });

  // Close search input when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".nav-search").length) {
      $(".nav-search-input-container").removeClass("active");
    }
  });

  // Handle search input
  $(".nav-search-input").on("input", function () {
    const searchText = $(this).val().toLowerCase();
    // Add your search logic here
    console.log("Searching for:", searchText);
  });

  // Prevent search input close when clicking inside it
  $(".nav-search-input").click(function (e) {
    e.stopPropagation();
  });

  // Handle ESC key to close search
  $(document).keyup(function (e) {
    if (e.key === "Escape") {
      $(".nav-search-input-container").removeClass("active");
    }
  });

  // Update these variable names and add better comments
  function formatDateTime(dateTimeStr) {
    const dateObj = new Date(dateTimeStr);

    const longDateFormat = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);

    const shortDateFormat = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }).format(dateObj);

    return {
      longFormat: longDateFormat,
      shortFormat: shortDateFormat,
    };
  }

  // Initialize date formatting for table cells
  $(".sent-cell").each(function () {
    const originalDateTime = $(this).text().trim();
    const formattedDateTime = formatDateTime(originalDateTime);

    $(this).html(`
      <span class="full-time" title="${formattedDateTime.longFormat}">${formattedDateTime.longFormat}</span>
      <span class="short-time" title="${formattedDateTime.longFormat}">${formattedDateTime.shortFormat}</span>
    `);
  });

  // Table search with debounce
  let searchDebounceTimer;
  $(".table-search").on("input", function () {
    const $searchInput = $(this);
    const $tableRows = $(".data-table tbody tr");

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      const searchQuery = $searchInput.val().toLowerCase();

      $tableRows.each(function () {
        const $row = $(this);
        const rowContent = $row.text().toLowerCase();
        const isMatch = rowContent.includes(searchQuery);
        $row.toggle(isMatch);
      });
    }, 300);
  });

  // Pagination helpers with better naming
  function getCurrentPageNumber() {
    const paginationText = $(".pagination-range").text();
    return parseInt(paginationText.split("-")[0]);
  }

  function updatePaginationDisplay(currentPage, itemsPerPage, totalItems) {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);
    $(".pagination-range").text(`${startIndex}-${endIndex} of ${totalItems}`);
  }

  function displayPageItems(pageNumber, itemsPerPage) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    $(".data-table tbody tr").hide().slice(startIndex, endIndex).show();
  }

  // Export table data with improved naming
  function exportTableData(exportFormat) {
    const tableHeaders = [];
    const tableRows = [];

    $(".data-table th").each(function () {
      tableHeaders.push($(this).text());
    });

    $(".data-table tbody tr:visible").each(function () {
      const rowData = [];
      $(this)
        .find("td")
        .each(function () {
          rowData.push($(this).text().trim());
        });
      tableRows.push(rowData);
    });

    let exportContent = "";
    const fileName = `table_export.${exportFormat}`;

    switch (exportFormat) {
      case "excel":
        exportContent = generateExcelContent(tableHeaders, tableRows);
        break;
      case "word":
        exportContent = generateWordContent(tableHeaders, tableRows);
        break;
      case "text":
        exportContent = generateTextContent(tableHeaders, tableRows);
        break;
    }

    downloadGeneratedFile(fileName, exportContent);
  }

  // Helper functions for export
  function generateExcelContent(headers, rows) {
    return (
      headers.join("\t") + "\n" + rows.map((row) => row.join("\t")).join("\n")
    );
  }

  function generateWordContent(headers, rows) {
    return `<table border="1">
      <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
      ${rows
        .map(
          (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
        )
        .join("")}
    </table>`;
  }

  function generateTextContent(headers, rows) {
    return (
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n")
    );
  }

  function downloadGeneratedFile(fileName, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Add hamburger menu toggle functionality
  const $navMenuToggle = $(
    '<button class="nav-menu-toggle"><span class="hamburger-icon"></span></button>'
  );
  $(".main-nav").prepend($navMenuToggle);

  $navMenuToggle.click(function (e) {
    e.stopPropagation();
    $(this).toggleClass("active");
    $(".nav-menu").toggleClass("active");
  });

  // Close menu when clicking outside
  $(document).click(function (e) {
    if (!$(e.target).closest(".nav-menu, .nav-menu-toggle").length) {
      $(".nav-menu").removeClass("active");
      $(".nav-menu-toggle").removeClass("active");
    }
  });

  // Handle submenu toggles on mobile
  $(".supervisor-item").click(function (e) {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      e.stopPropagation();
      $(this).toggleClass("active");
    }
  });

  // Update menu state on resize
  $(window).resize(function () {
    if (window.innerWidth > 1024) {
      $(".nav-menu").removeClass("active");
      $(".nav-menu-toggle").removeClass("active");
      $(".supervisor-item").removeClass("active");
    }
  });
});
