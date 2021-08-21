import { environment } from '../../../environments/environment';
import { Person } from '../interfaces/person.interface';
import { Menu } from '../interfaces/menu';

const base_url = environment.base_url;

export class User {

    constructor(

        public id: string,
        public usuario: string,
        public change_password: boolean,
        public person: Person,
        public menu: Array<any>,
        public password?: string,

    ) { }

    get imagenUrl() {
        if (!this.person.image) {
            return `assets/images/users/no-image.png`;
        } else if (this.person.image.includes('https')) {
            return this.person.image;
        } else if (this.person.image) {
            return `${base_url}/upload/usuarios/${this.person.image}`;
        } else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }

}

