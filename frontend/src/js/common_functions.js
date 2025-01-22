function fetchData(url) {
    const token = localStorage.getItem("jwt"); // Retrieve the JWT token

    fetch("https://your-backend-url/api/protected-route", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log("Protected data:", data);
            return data;
        })
        .catch((error) => {
            console.error("Error fetching protected data:", error.message);
            return error;
        });
}