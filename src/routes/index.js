// routes/index.js
import HomePage from '../pages/Home/HomePage';
import TeamPage from '../pages/Teams/TeamPage';
import Profile from '../pages/UserCRUD/Profile';
import PersonalTasksPage from '../pages/Tasks/PersonalTasksPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import CreateProfilePage from '../pages/UserCRUD/CreateProfilePage';
import TeamDetailPage from '../pages/Teams/TeamDetailPage';
import ProfileId from '../pages/UserCRUD/ProfileId';

export const publicRoutes = [
    { path: '/', component: AuthPage, layout: null },
    { path: '/create-profile', component: CreateProfilePage },
    { path: '/profile/:id', component: ProfileId },
];

export const privateRoutes = [
    { path: '/home', component: HomePage },
    { path: '/team', component: TeamPage },
    { path: '/profile', component: Profile },
    { path: '/teams/:id', component: TeamDetailPage },
    { path: '/personal-tasks', component: PersonalTasksPage },
];
