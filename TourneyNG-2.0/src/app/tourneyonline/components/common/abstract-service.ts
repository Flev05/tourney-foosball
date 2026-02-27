export abstract class AbstractService  {

    // cloneObject(c: any): any {
    //     let obj = {};
    //     for (let prop in c) {
    //         obj[prop] = c[prop];
    //     }
    //     return obj;
    // }

    protected onComplete() {
    }
    protected onError(n:any) {
        console.error(n);
    }

}
