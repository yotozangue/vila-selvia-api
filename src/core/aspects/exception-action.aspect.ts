import { Aspect, AspectContext } from '@arekushii/ts-aspect';


export class ExceptionActionAspect implements Aspect {

    execute(ctx: AspectContext): void {

        console.log(ctx.error);

        if (ctx.params) {
            throw ctx.error;
        }
    }
}
