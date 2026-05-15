import { of } from 'rxjs';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  it('creates and finds an order', async () => {
    const usersClient = {
      send: jest.fn().mockReturnValue(
        of({
          id: 'user_1',
          email: 'john@example.com',
          name: 'John Doe',
          createdAt: new Date().toISOString(),
        }),
      ),
    };

    const service = new OrdersService(usersClient as never);
    const order = await service.create({
      userId: 'user_1',
      items: [{ productId: 'sku_123', quantity: 2 }],
    });

    expect(order.id).toBeDefined();
    expect(service.findOne(order.id)).toEqual(order);
  });
});
