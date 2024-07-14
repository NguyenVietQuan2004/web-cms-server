import StoreRoutes from './StoreRoutes.js';
import AccountRoutes from './AccountRoutes.js';

export default function Routes(app) {
    app.use('/store', StoreRoutes);
    app.use('/auth', AccountRoutes);
}
