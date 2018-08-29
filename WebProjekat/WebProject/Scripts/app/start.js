var pages = [];
var authToken = localStorage.getItem("authToken");
var genders = [{ name: "Male", id: 0 }, { name: "Female", id: 1 }, { name: "Other", id: 2 }];
var roles = [{ name: "Customer", id: 0 }, { name: "Dispatcher", id: 1 }, { name: "Driver", id: 2 }];
var vehicleTypes = [{ name: "Car", id: 0 }, { name: "Van", id: 1 }];
var rideStatuses = [{ name: "Created", id: 0 }, { name: "Cancelled", id: 1 }, { name: "Formed", id: 2 }, { name: "Processed", id: 3 }, { name: "Accepted", id: 4 }, { name: "Successful", id: 5 }, { name: "Failed", id: 6 }];