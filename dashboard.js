// Sample data
let data = [];
let selectedRows = [];
let currentPage = 1;

// Function to generate pagination buttons
function generatePagination() {
    const paginationContainer = $("#pagination-container");
    paginationContainer.empty(); // Clear existing content

    const totalPages = Math.ceil(data.length / 10);

    // Add special buttons for first page, previous page, next page, and last page
    $("<button>").text("First").addClass("first-page").click(() => handlePagination(1)).appendTo(paginationContainer);
    $("<button>").text("Previous").addClass("previous-page").click(() => handlePagination(currentPage - 1)).appendTo(paginationContainer);

    // Add individual page buttons
    for (let i = 1; i <= totalPages; i++) {
        $("<button>").text(i).addClass("page").click(() => handlePagination(i)).appendTo(paginationContainer);
    }

    // Add special buttons for next page and last page
    $("<button>").text("Next").addClass("next-page").click(() => handlePagination(currentPage + 1)).appendTo(paginationContainer);
    $("<button>").text("Last").addClass("last-page").click(() => handlePagination(totalPages)).appendTo(paginationContainer);
}

// Function to generate the table
function generateTable() {
    const tableContainer = $("#table-container");
    tableContainer.empty(); // Clear existing content

    // Filter data based on search input
    const searchInput = $("#search-bar").val().toLowerCase();
    const filteredData = data.filter(row =>
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchInput))
    );

    // Calculate the current page and total pages
    const totalPages = Math.ceil(filteredData.length / 10);
    currentPage = Math.min(currentPage, totalPages);

    // Get the data for the current page
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const pageData = filteredData.slice(startIndex, endIndex);

    const table = $("<table>").appendTo(tableContainer);
    const thead = $("<thead>").appendTo(table);
    const tbody = $("<tbody>").appendTo(table);

    // Add table header
    const headerRow = $("<tr>").appendTo(thead);
    $("<th>").text("ID").appendTo(headerRow);
    $("<th>").text("Name").appendTo(headerRow);
    $("<th>").text("Email").appendTo(headerRow);
    $("<th>").text("Role").appendTo(headerRow);
    $("<th>").text("Actions").appendTo(headerRow);

    // Add table rows
    pageData.forEach((row, index) => {
        const tr = $("<tr>").appendTo(tbody);
        $("<td>").text(row.id).appendTo(tr);
        $("<td>").text(row.name).appendTo(tr);
        $("<td>").text(row.email).appendTo(tr);
        $("<td>").text(row.role).appendTo(tr);

        // Add Edit and Delete buttons with click event handlers
        const actionsTd = $("<td>").appendTo(tr);
        $("<button>").text("Edit").addClass("edit").click(() => handleEdit(index, tr)).appendTo(actionsTd);
        $("<button>").text("Delete").addClass("delete").click(() => handleDelete(index)).appendTo(actionsTd);

        // Add row selection checkbox
        const checkboxTd = $("<td>").appendTo(tr);
        $("<input>").attr("type", "checkbox").addClass("row-checkbox").change(() => handleCheckboxChange(index)).appendTo(checkboxTd);
    });

    generatePagination(); // Generate pagination buttons
}

// Function to fetch data from the API using Axios
async function fetchData() {
    try {
        console.log('Fetching data...');
        const apiUrl = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
        const response = await axios.get(apiUrl);

        if (!response.data || !Array.isArray(response.data)) {
            console.error('Invalid data received from the API:', response.data);
            throw new Error('Invalid data received from the API');
        }

        data = response.data; // Assuming data is directly an array
        console.log('Data fetched successfully:', data);
        generateTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to handle delete action
function handleDelete(index) {
    data.splice(index, 1);
    generateTable();
}
// ... (previous code)

// Function to handle checkbox toggle all
function handleToggleAll() {
    const isChecked = $("#toggle-all-checkbox").prop("checked");
    $(".row-checkbox").prop("checked", isChecked);

    if (isChecked) {
        // Select all rows and add 'selected' class
        $(".row-checkbox").each(function (index) {
            if (index < data.length) {
                selectedRows.push(index);
                $(this).closest("tr").addClass("selected");
            }
        });
    } else {
        // Deselect all rows and remove 'selected' class
        $(".row-checkbox").each(function (index) {
            if (index < data.length) {
                selectedRows = selectedRows.filter(i => i !== index);
                $(this).closest("tr").removeClass("selected");
            }
        });
    }
}

// ... (rest of the code)

// Function to handle edit action
// ... (previous code)

// Function to handle edit action
function handleEdit(index, row) {
    const isEditing = row.hasClass("editing");

    if (isEditing) {
        // Save changes
        const name = row.find("td:nth-child(2) input").val();
        const email = row.find("td:nth-child(3) input").val();
        const role = row.find("td:nth-child(4) input").val();

        // Validate edited data (you can add more validation as needed)
        if (name && email && role) {
            data[index].name = name;
            data[index].email = email;
            data[index].role = role;
            row.removeClass("editing");
            generateTable();
        } else {
            alert("Please fill in all fields before saving.");
        }
    } else {
        // Enter edit mode
        row.addClass("editing");
        const nameInput = $("<input>").val(data[index].name);
        const emailInput = $("<input>").val(data[index].email);
        const roleInput = $("<input>").val(data[index].role);

        row.find("td:nth-child(2)").empty().append(nameInput);
        row.find("td:nth-child(3)").empty().append(emailInput);
        row.find("td:nth-child(4)").empty().append(roleInput);

        // Replace "Edit" button with "Save" button
        row.find(".edit").text("Save").removeClass("edit").addClass("save").off("click").click(() => handleSave(index, row));
    }
}

// Function to handle save action
function handleSave(index, row) {
    // Save logic is the same as in handleEdit
    const name = row.find("td:nth-child(2) input").val();
    const email = row.find("td:nth-child(3) input").val();
    const role = row.find("td:nth-child(4) input").val();

    if (name && email && role) {
        data[index].name = name;
        data[index].email = email;
        data[index].role = role;
        row.removeClass("editing");
        generateTable();
    } else {
        alert("Please fill in all fields before saving.");
    }
}

// ... (rest of the code)

// ... (previous code)

// Function to handle checkbox change
function handleCheckboxChange(index) {
    const checkbox = $(".row-checkbox").eq(index);
    const isChecked = checkbox.prop("checked");

    if (isChecked) {
        selectedRows.push(index);
        checkbox.closest("tr").addClass("selected");
    } else {
        selectedRows = selectedRows.filter(i => i !== index);
        checkbox.closest("tr").removeClass("selected");
    }
}

// Function to handle delete selected action
function handleDeleteSelected() {
    selectedRows.sort((a, b) => b - a); // Sort in descending order to delete from the end
    selectedRows.forEach(index => {
        data.splice(index, 1);
        // Reset selected class for the deleted row
        $(`#table-container tbody tr:eq(${index})`).removeClass("selected");
    });
    selectedRows = [];
    generateTable();
}

// ... (rest of the code)

// Function to handle checkbox change
function handleCheckboxChange(index) {
    const checkbox = $(".row-checkbox").eq(index);
    const isChecked = checkbox.prop("checked");

    if (isChecked) {
        selectedRows.push(index);
    } else {
        selectedRows = selectedRows.filter(i => i !== index);
    }
}
function handleSearch() {
    generateTable();
}

// Event listener for ENTER key press in the search bar
$("#search-bar").on("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});
// Function to handle delete selected action
function handleDeleteSelected() {
    selectedRows.sort((a, b) => b - a); // Sort in descending order to delete from the end
    selectedRows.forEach(index => data.splice(index, 1));
    selectedRows = [];
    generateTable();
}

// Function to handle checkbox toggle all
function handleToggleAll() {
    const isChecked = $("#toggle-all-checkbox").prop("checked");
    $(".row-checkbox").prop("checked", isChecked);
    selectedRows = isChecked ? Array.from({ length: 10 }, (_, i) => i) : [];
}

// Function to handle pagination
function handlePagination(pageNumber) {
    // Your pagination logic goes here
    // Update data based on the selected page
    const startIndex = (pageNumber - 1) * 10;
    const endIndex = startIndex + 10;
    const pageData = data.slice(startIndex, endIndex);
    currentPage = pageNumber;
    generateTable(pageData);
}

// Initial setup
$(document).ready(function() {
    fetchData();
});
