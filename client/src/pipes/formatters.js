export function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "$0.00";
    }

    return "$" + Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function formatPercent(value) {
    if (value === null || value === undefined) {
        return "0.00%";
    }

    return Number(value).toFixed(2) + "%";
}

export function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString();
}

export function formatSymbol(value) {
    if (!value) {
        return "";
    }

    return value.toUpperCase();
}

export function formatRole(value) {
    if (!value) {
        return "Guest";
    }

    return value === "Admin" ? "Administrator" : "Regular User";
}