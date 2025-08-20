import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// tạo/đảm bảo category theo (name + parentCategoryId)
async function ensureCategory(name: string, parentId: number | null = null) {
    const existing = await prisma.category.findFirst({
        where: { name, parentCategoryId: parentId },
        select: { id: true },
    });
    if (existing) return existing;
    return prisma.category.create({
        data: { name, parentCategoryId: parentId },
        select: { id: true },
    });
}

async function main() {
    // Cấp 1
    const cleaning = {
        id: 2
    }
    const repair = {
        id: 1
    }

    // Cấp 2: Dọn dẹp
    await Promise.all([

        ensureCategory('Dọn dẹp nhà', cleaning.id),
        ensureCategory('Tổng vệ sinh', cleaning.id),
        ensureCategory('Vệ sinh sofa', cleaning.id),
        ensureCategory('Vệ sinh thảm', cleaning.id),
        ensureCategory('Vệ sinh kính', cleaning.id),
        ensureCategory('Giặt rèm/màn', cleaning.id),
    ]);

    // Cấp 2: Sửa chữa
    await Promise.all([
        ensureCategory('Sửa máy lạnh', repair.id),
        ensureCategory('Sửa máy giặt', repair.id),
        ensureCategory('Sửa tủ lạnh', repair.id),
        ensureCategory('Sửa điện nước', repair.id),
        ensureCategory('Sửa bếp gas/điện', repair.id),
        ensureCategory('Sửa TV', repair.id),
        ensureCategory('Sửa quạt/máy hút bụi', repair.id),
    ]);

    console.log('✅ Seed Category done');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
