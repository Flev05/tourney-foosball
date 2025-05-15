
import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if(args == false) {
            return super.transform(value, "dd/MM/yyyy");
        }
        return super.transform(value, "dd/MM/yyyy HH:mm");
    }
    transformWeek(value: any): any {
         return super.transform(value, "EEE dd/MM/yyyy HH:mm");
    }
}
