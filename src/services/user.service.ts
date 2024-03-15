import { authRepository } from './auth.repository'
import { User } from '../model/user'

class UserService {

    private readonly urlBase = 'http://localhost:3030/users'

    private getHeaders() {
        const logged = authRepository.getLoggedUser()
        const token = logged ? logged.token : ''
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    private async getData(response: Response) {
        if (response.ok) {
            return await response.json()
        } else {
            if (response.status === 401 || response.status === 403) return null
            
            if (response.status === 400) {
                throw new Error('Usuário já existe!')
            } else {
                throw new Error(response.statusText, { cause: response.status })
            }
        }
    }

    public async getList() {
        const response = await fetch(this.urlBase, {
            method: 'GET',
            headers: this.getHeaders()
        })

        const data = await this.getData(response)
        if (data) {
            return data as User[]
        } else {
            return null
        }
    }

    public async create(user: User) {
        const response = await fetch(this.urlBase, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(user)
        })

        const data = await this.getData(response)
        if (data) {
            const saved: User = data
            return (saved && saved.id) ? true : false
        } else {
            return null
        }
    }

}

export const userService = new UserService()