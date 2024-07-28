import SizeRoutes from './SizeRoutes.js';
import OrderRoutes from './OrderRoutes.js';
import ColorRoutes from './ColorRoutes.js';
import StoreRoutes from './StoreRoutes.js';
import ProductRoutes from './ProductRoutes.js';
import AccountRoutes from './AccountRoutes.js';
import CategoryRoutes from './CategoryRoutes.js';
import BillboardRoutes from './BillboardRoutes.js';

export default function Routes(app) {
    app.use('/size', SizeRoutes);
    app.use('/color', ColorRoutes);
    app.use('/order', OrderRoutes);
    app.use('/store', StoreRoutes);
    app.use('/auth', AccountRoutes);
    app.use('/product', ProductRoutes);
    app.use('/category', CategoryRoutes);
    app.use('/billboard', BillboardRoutes);
}
