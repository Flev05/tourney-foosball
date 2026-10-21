export abstract class AbstractService  {
    protected onComplete() {
    }
    protected onError(n:any) {
        console.error(n);
    }
}
