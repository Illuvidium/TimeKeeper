import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './pages/home/home.module';
import { TasksModule } from './pages/tasks/tasks.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './layout/menu/menu.component';
import { TagsComponent } from './pages/tags/tags.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ClockingComponent } from './pages/clocking/clocking.component';
import { TagsModule } from './pages/tags/tags.module';
import { ClockingModule } from './pages/clocking/clocking.module';
import { TitleBarComponent } from './layout/title-bar/title-bar.component';
import { ReportsModule } from './pages/reports/reports.module';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
	declarations: [AppComponent, MenuComponent, TagsComponent, ReportsComponent, ClockingComponent, TitleBarComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		SharedModule,
		HomeModule,
		TagsModule,
		TasksModule,
		ClockingModule,
		ReportsModule,
		AppRoutingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: httpLoaderFactory,
				deps: [HttpClient],
			},
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
