import { Injectable } from "@nestjs/common";

@Injectable()
export class ReferenceService {
  generateReference(prefix: string = "MT", length: number = 4): string {
    const randomChars = this.generateRandomString(length);
    return `${prefix}${randomChars}`;
  }

  generateUniqueReferences(
    count: number = 1,
    prefix: string = "MT",
    randomLength: number = 4,
  ): string[] {
    const references = new Set<string>();

    while (references.size < count) {
      const reference = this.generateReference(prefix, randomLength);
      references.add(reference);
    }

    return Array.from(references);
  }

  private generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}
