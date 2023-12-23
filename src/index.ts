import {  Router } from "./router";
import { AboutUsPage, BucketPage, MainPage } from "./pages";
import './style.css'

const appRouter = new Router([
  {
    path: '',
    redirectTo: '/main'
  },
  {
    path: 'main',
    page: MainPage,
  },
  {
    path: 'about-us',
    page: AboutUsPage,
  },
  {
    path: 'bucket',
    page: BucketPage,
  },
]);

appRouter.start();
