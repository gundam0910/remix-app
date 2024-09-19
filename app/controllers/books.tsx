import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export function getBooks() {
  return prisma.book.findMany()
}

export function getBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
  })
}

export function createBook(book: unknown) {
  return prisma.book.create({ data: book })
}

export function updateBook(id: string, book: unknown) {
  return prisma.book.update({
    where: { id },
    data: book,
  })
}

export function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id },
  })
}