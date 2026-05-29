export class ActivityLog {
    constructor(id, user, action, details, createdAt) {
        this.id = id;
        this.user = user;
        this.action = action;
        this.details = details;
        this.createdAt = createdAt;
    }
}