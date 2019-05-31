import * as UUID from 'uuid/v4'

class Player {
    public id:      string
    public name:    string
    public level:   number
    public realm:   string

    constructor(name: string, level: number, realm: string) {
        this.id     = UUID()
        this.name   = name
        this.level  = level
        this.realm  = realm
    }


}

export default Player