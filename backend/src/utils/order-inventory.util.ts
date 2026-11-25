import { Prisma } from '@prisma/client';
import { AppError } from './app-error.util.js';

export interface OrderStockItem {
  productId: string;
  quantity: number;
  options: Array<{ productVariantId: string | null }>;
}

const aggregateStockQuantities = (items: OrderStockItem[]) => {
  const productQuantities = new Map<string, number>();
  const variantQuantities = new Map<string, number>();

  for (const item of items) {
    productQuantities.set(
      item.productId,
      (productQuantities.get(item.productId) || 0) + item.quantity
    );
    for (const option of item.options) {
      if (option.productVariantId) {
        variantQuantities.set(
          option.productVariantId,
          (variantQuantities.get(option.productVariantId) || 0) + item.quantity
        );
      }
    }
  }

  return {
    sortedProducts: [...productQuantities.entries()].sort(([a], [b]) => a.localeCompare(b)),
    sortedVariants: [...variantQuantities.entries()].sort(([a], [b]) => a.localeCompare(b)),
  };
};

export async function reserveOrderInventory(
  tx: Prisma.TransactionClient,
  items: OrderStockItem[]
): Promise<void> {
  const { sortedProducts, sortedVariants } = aggregateStockQuantities(items);

  for (const [productId, quantity] of sortedProducts) {
    const result = await tx.product.updateMany({
      where: { id: productId, stock: { gte: quantity }, isAvailable: true, deletedAt: null },
      data: { stock: { decrement: quantity } },
    });
    if (result.count !== 1) {
      throw new AppError(
        'Stok produk berubah atau tidak mencukupi. Muat ulang keranjang Anda.',
        409
      );
    }
  }

  for (const [variantId, quantity] of sortedVariants) {
    const result = await tx.productVariant.updateMany({
      where: { id: variantId, stock: { gte: quantity } },
      data: { stock: { decrement: quantity } },
    });
    if (result.count !== 1) {
      throw new AppError(
        'Stok pilihan produk berubah atau tidak mencukupi. Muat ulang keranjang Anda.',
        409
      );
    }
  }
}

export async function releaseOrderInventory(
  tx: Prisma.TransactionClient,
  items: OrderStockItem[]
): Promise<void> {
  const { sortedProducts, sortedVariants } = aggregateStockQuantities(items);

  for (const [productId, quantity] of sortedProducts) {
    await tx.product.updateMany({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }

  for (const [variantId, quantity] of sortedVariants) {
    await tx.productVariant.updateMany({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    });
  }
}
