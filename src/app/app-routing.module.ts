import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagsComponent } from './pages/tags/tags.component';
import { ClockingComponent } from './pages/clocking/clocking.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'clocking',
		pathMatch: 'full',
	},
	{
		path: 'tags',
		component: TagsComponent,
	},
	{
		path: 'tasks',
		component: TasksComponent,
	},
	{
		path: 'clocking',
		component: ClockingComponent,
	},
	{
		path: 'reports',
		component: ReportsComponent,
	},
	{
		path: '**',
		component: ClockingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {})],
	exports: [RouterModule],
})
export class AppRoutingModule {}
