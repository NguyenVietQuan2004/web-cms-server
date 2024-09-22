import cron from 'node-cron';
import { ordersModel } from '../Models/OrderModel.js';
import { productsModel } from '../Models/ProductModel.js';
import mongoose from 'mongoose';
//{
//  _id,
//  phone,
//  storeId,
//  address,
//  isPaid,
//  listProductOrder: [{productId: , size: , color: , amount: }]
//  createdAt,
//  updatedAt,
//}

// [POST] /order
cron.schedule('*/30 * * * * *', async () => {
    try {
        const numMinute = 1;
        const AnyMinutesAgo = new Date(Date.now() - numMinute * 60 * 1000); // 5 phút trước
        const expiredOrders = await ordersModel.find({
            isPaid: false,
            createdAt: { $lte: AnyMinutesAgo },
        });

        if (expiredOrders.length > 0) {
            console.log(`Found ${expiredOrders.length} expired orders, processing cancellation...`);

            // Xóa các đơn hàng hết hạn và chưa thanh toán
            await ordersModel.deleteMany({ _id: { $in: expiredOrders.map((order) => order._id) } });
            // tra lai so luong san pham
            for (const order of expiredOrders) {
                const listProductOrder = order.listProductOrder;
                for (const productOrder of listProductOrder) {
                    const existProduct = await productsModel.findOne({
                        storeId: order.storeId,
                        _id: productOrder._id,
                    });

                    if (!existProduct) {
                        console.log('Khong tim thay san pham khi tra lai so luong cua san pham khi huy don hang');
                    }
                    const size = productOrder.size;
                    const amount = productOrder.amount;
                    const objectPrice = existProduct.arrayPrice.find((objectPrice) => objectPrice.size === size);
                    if (objectPrice) {
                        await productsModel.updateOne(
                            {
                                storeId: order.storeId,
                                _id: productOrder._id,
                            },
                            {
                                $set: {
                                    'arrayPrice.$[elem].amount': objectPrice.amount + amount,
                                    'arrayPrice.$[elem].amount_sold': objectPrice.amount_sold - amount,
                                },
                            },
                            {
                                arrayFilters: [{ 'elem.size': objectPrice.size }],
                            },
                        );
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error during checking expired orders:', error);
    }
});
export const createOrder = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
        const newOrderFromClient = req.body;
        if (!newOrderFromClient.storeId || !newOrderFromClient.listProductOrder.length) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information order.',
                ok: false,
                data: null,
            });
        }

        const listProductOrder = newOrderFromClient.listProductOrder;
        for (const productOrder of listProductOrder) {
            const existProduct = await productsModel.findOne({
                storeId: newOrderFromClient.storeId,
                _id: productOrder._id,
            });

            if (!existProduct) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Product order id  is wrong.',
                    ok: false,
                    data: null,
                });
            }
            const size = productOrder.size;
            const amount = productOrder.amount;
            const objectPrice = existProduct.arrayPrice.find((objectPrice) => objectPrice.size === size);
            if (objectPrice.amount - amount < 0) {
                console.log('da chay len day');
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Product is not enough amount.',
                    ok: false,
                    data: null,
                });
            }
        }

        // Giải quyết trường hợp 1 cái đặt được nhưng mấy cái sau ko đặt được

        for (const productOrder of listProductOrder) {
            const existProduct = await productsModel.findOne({
                storeId: newOrderFromClient.storeId,
                _id: productOrder._id,
            });
            const size = productOrder.size;
            const amount = productOrder.amount;
            const objectPrice = existProduct.arrayPrice.find((objectPrice) => objectPrice.size === size);
            console.log(size, objectPrice);
            const data = await productsModel.updateOne(
                {
                    storeId: newOrderFromClient.storeId,
                    _id: productOrder._id,
                },
                {
                    $set: {
                        'arrayPrice.$[elem].amount_sold': objectPrice.amount_sold + amount,
                        'arrayPrice.$[elem].amount': objectPrice.amount - amount,
                    },
                },
                {
                    arrayFilters: [{ 'elem.size': objectPrice.size }],
                },
            );
            console.log(data);
        }

        const order = await ordersModel(newOrderFromClient);
        await order.save();
        // await session.commitTransaction();
        res.status(200).json({
            data: order,
            message: 'Create order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        // await session.abortTransaction();
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Create order failed.',
            ok: false,
        });
    } finally {
        // session.endSession(); // Đóng session sau khi giao dịch hoàn tất
    }
};
// [GET] /order/getall

export const getAllOrder = async (req, res) => {
    try {
        if (!req.query.storeId) {
            res.status(200).json({
                data: null,
                statusCode: 200,
                message: 'Store id is missing.',
                ok: true,
            });
        }
        const listOrder = await ordersModel
            .find({
                storeId: req.query.storeId,
            })
            .sort({ createdAt: -1 })
            .populate({
                path: 'listProductOrder._id',
                model: 'products',
            });
        res.status(200).json({
            data: listOrder,
            statusCode: 200,
            message: 'Get list order success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get listModel failed.',
            ok: false,
        });
    }
};
// [PUT] /order
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.body._id;
        const phone = req.body.phone;
        const address = req.body.address;
        const isPaid = req.body.isPaid;
        if (!orderId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Missing information order .',
                ok: false,
                data: null,
            });
        }

        const existOrder = await ordersModel.findOne({
            _id: orderId,
        });

        if (!existOrder) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Order id or store id is wrong.',
                ok: false,
                data: null,
            });
        }
        const newOrderUpdate = await ordersModel.findOneAndUpdate(
            {
                _id: orderId,
            },
            {
                isPaid,
                phone,
                address,
            },
            {
                new: true,
            },
        );
        res.status(200).json({
            data: newOrderUpdate,
            statusCode: 200,
            message: 'Update order success.',
            ok: true,
        });
    } catch (error) {
        res.status(401).json({
            data: error,
            statusCode: 401,
            message: 'Something went wrong. Update order failed.',
            ok: false,
        });
    }
};
// [DELETE] /order

export const deleteOrder = async (req, res) => {
    const orderId = req.body._id;
    const storeId = req.body.storeId;
    try {
        if (!orderId || !storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Order id or store id  is missing.',
                ok: false,
                data: null,
            });
        }

        const orderDeleted = await ordersModel.findOneAndDelete({
            _id: orderId,
            storeId,
        });
        res.status(200).json({
            data: orderDeleted,
            message: 'Delete order success.',
            ok: true,
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Something went wrong. Delete order failed',
            ok: false,
            data: error,
        });
    }
};

// [GET] /overview
export const overviewOrder = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        if (!storeId) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Store id  is missing.',
                ok: false,
                data: null,
            });
        }

        const listOrderPaid = await ordersModel
            .find({
                storeId,
                isPaid: true,
            })
            .populate({
                path: 'listProductOrder._id',
                model: 'products',
            });
        const countProductsInStock = await productsModel.countDocuments({
            storeId,
            isArchive: false,
        });

        res.status(200).json({
            data: {
                listOrderPaid,
                countProductsInStock,
            },
            statusCode: 200,
            message: 'Get overview order success',
            ok: true,
        });
    } catch (error) {
        res.status(500).json({
            data: error,
            statusCode: 500,
            message: 'Something went wrong. Get overview failed.',
            ok: false,
        });
    }
};
