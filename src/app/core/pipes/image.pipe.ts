import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: 'users' | 'persons' | 'companies'): string {

    
    
    if (!img) {
      return `assets/images/users/no-image.png`;
    } else if (img.includes('https') || img.includes('http')) {
      return img;
    } else if (img) {
      return `${base_url}/image?path=${img}`;
    } else {
      return `assets/images/users/no-image.png`;
      /* return `${base_url}/upload/usuarios/no-image`; */
    }

  }



}
