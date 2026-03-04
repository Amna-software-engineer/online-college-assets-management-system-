export const authEndPoints = {
    register: "/auth/register",
    login: "/auth/login",
}
export const assetEndPoints = {
    asset: "/asset",
    faculty: "/faculty",
    deleteFaculty: (id) => `/faculty/${id}`,
}
export const requestEndPoints = {
    request: "/request",
    updateRequest: (id) => `/request/${id}`,
    deleteRequest: (id) => `/request/${id}`,
}
export const deptEndPoints = {
    request: "/department",
}