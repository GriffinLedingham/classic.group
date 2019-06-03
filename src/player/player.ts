import * as UUID from 'uuid/v4'

class Player {
    public id:      string
    public name:    string
    public level:   number
    public realm:   string
    public role:    string
    public queueKey:string
    public groupId: string
    public playerClass: string

    constructor(name: string, level: number, realm: string, role: string, playerClass: string) {
        this.id     = UUID()
        this.name   = name
        this.level  = level
        this.realm  = realm
        this.role   = role
        this.queueKey = null
        this.groupId  = null
        this.playerClass  = playerClass
    }

    setQueueKey(key: string) {
        this.queueKey = key
    }

    removeQueueKey() {
        this.queueKey = null
    }

    setGroupId(id: string) {
        this.groupId = id
    }

    removeGroupId() {
        this.groupId = null
    }
}

export default Player