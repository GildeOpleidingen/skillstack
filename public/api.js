

// TODO...
export function getDashboardData() {
    return $.ajax({
        url: "api/dashboard",
        method: "GET",
        dataType: "json"
    });
}
