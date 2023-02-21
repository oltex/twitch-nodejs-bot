class user {
    constructor(channel) {
        this._channel = channel;

        this._enable_ban_viewbot = false;
        this._except_ban_viewbot = new Array();

        this._osu_account = "";
        this._access_osu_account = false;
        this._enable_osu_request = false;
    }
}
let users = new Array();
module.exports = {
    user, users
}