import request from '@/utils/request'
// 注册
export function resiger(data) {
    return request({
        url: '/api/registered',
        method: 'post',
        data
    })
}
// 获取验证码
export function captcha(data) {
    return request({
        url: '/api/captchaController/generateVerifyCodeOfReport',
        method: 'post',
        data
    })
}
export function login(data) {
    return request({
        // url: '/vue-admin-template/user/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/vue-admin-template/user/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/vue-admin-template/user/logout',
        method: 'post'
    })
}