// import { environment } from './environments/environment';
// import { enableProdMode } from '@angular/core';
// if (environment.production) {  
//    enableProdMode();
// } 
// export {AppServerModule} from './app/app.server.module';

import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { ngExpressEngine as engine } from '@nguniversal/express-engine';
import { NgExpressEngineDecorator } from './ssr/ng-express-engine-decorator';
export const ngExpressEngine = NgExpressEngineDecorator.get(engine);