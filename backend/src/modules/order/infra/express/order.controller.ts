import { Request, Response } from 'express';
import { OrderUseCases } from '../../app/usecases';
import { CreateOrderDto, UpdateOrderDto } from '../../app/dto/order-input.dto';

export class OrderController {
  constructor(private readonly orderUseCases: OrderUseCases) {}

  async createOrder(req: Request, res: Response) {
    try {
      const orderData: CreateOrderDto = req.body;
      const order = await this.orderUseCases.createOrder(orderData);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await this.orderUseCases.getAllOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderUseCases.getOrderById(id);
      res.status(200).json(order);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getOrdersByCustomerId(req: Request, res: Response) {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await this.orderUseCases.getOrdersByCustomerId(customerId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const orderData: UpdateOrderDto = req.body;
      const order = await this.orderUseCases.updateOrder(id, orderData);
      res.status(200).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.orderUseCases.deleteOrder(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
  async updateStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const validStatuses = ['PENDING', 'ACCEPTED', 'DELIVERED'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Valid status is required. Must be one of: PENDING, ACCEPTED, DELIVERED, REJECTED' 
        });
      }
  
      const orderData: UpdateOrderDto = { status };
      const order = await this.orderUseCases.updateOrder(id, orderData);
      res.status(200).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

} 