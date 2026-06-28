import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContentEntity } from "src/entities/entity/content.entity";
import { Repository } from "typeorm";

const DEFAULT_CONTENT: Array<{ key: string; en: string; ka: string }> = [
  { key: "hero_title", en: "Welcome to Mtiskari", ka: "მოგესალმებათ მწისქარში" },
  { key: "hero_subtitle", en: "Experience luxury amidst nature's beauty", ka: "ბუნების სილამაზის ფონზე განიცადეთ სიამოვნება" },
  { key: "hero_btn", en: "Book Now", ka: "დაჯავშნა" },
  { key: "gallery_title", en: "Discover the Beauty of Mtiskari", ka: "აღმოაჩინეთ მწისქარის სილამაზე" },
  { key: "gallery_btn", en: "See more", ka: "მეტის ნახვა" },
  { key: "cottage_title", en: "Mtiskari Cottage Features", ka: "მწისქარის კოტეჯის მახასიათებლები" },
  { key: "cottage_subtitle", en: "Experience comfort in nature with all modern amenities", ka: "ბუნებაში კომფორტი თანამედროვე მოხერხებულობით" },
  { key: "cottage_desc", en: "This charming Mtiskari cottage offers the perfect blend of rustic charm and modern comfort. Enjoy breathtaking mountain views from your balcony, cook meals in the fully-equipped kitchen, and relax in the cozy bedrooms after a day of exploring nature.", ka: "ეს მომხიბვლელი კოტეჯი გთავაზობთ სოფლური სიმყუდროვისა და თანამედროვე კომფორტის სრულყოფილ სინთეზს. ტკბებით ბალკონიდან გახსნილი მთის პანორამით, მოამზადეთ ჰემო საჭმელი სრულად აღჭურვილ სამზარეულოში." },
  { key: "cottage_getaway_title", en: "Perfect Nature Getaway", ka: "სრულყოფილი დასვენება ბუნებაში" },
  { key: "contact_title", en: "Get In Touch", ka: "დაგვიკავშირდით" },
  { key: "contact_subtitle", en: "Ready to experience Mtiskari? Contact us for bookings and inquiries", ka: "მზად ხართ მწისქარის სანახავად? დაგვიკავშირდით ჯავშანისა და კითხვების შესახებ" },
  { key: "contact_cta_title", en: "Ready for Your Mountain Getaway?", ka: "მზად ხართ მთაში სამოგზაუროდ?" },
  { key: "contact_cta_desc", en: "Contact us today to book your stay at Mtiskari Cottage. Whether you're planning a romantic escape, family vacation, or solo adventure in nature, we're here to help you create unforgettable memories in the heart of Racha.", ka: "დაგვიკავშირდით დღეს, რომ დაჯავშნოთ ადგილი მწისქარის კოტეჯში. იქნება ეს რომანტიული შვებულება, ოჯახური დასვენება თუ სოლო თავგადასავალი ბუნებაში — ჩვენ აქ ვართ." },
  { key: "checkin_label", en: "Check-in", ka: "შემოსვლა" },
  { key: "checkout_label", en: "Check-out", ka: "გასვლა" },
  { key: "guests_label", en: "Guests", ka: "სტუმრები" },
  { key: "total_cost_label", en: "Total Cost", ka: "სრული ღირებულება" },
  { key: "nights_label", en: "nights", ka: "ღამე" },
  { key: "nav_home", en: "Home", ka: "მთავარი" },
  { key: "nav_gallery", en: "Gallery", ka: "გალერეა" },
  { key: "nav_contact", en: "Contact", ka: "კონტაქტი" },
  { key: "gallery_page_title", en: "Mtiskari Gallery", ka: "მწისქარის გალერეა" },
  { key: "gallery_page_subtitle", en: "Immerse yourself in the breathtaking beauty of Mtiskari through our collection of stunning photographs", ka: "ჩაეფლეთ მწისქარის ხიბლში ჩვენი განსაცვიფრებელი ფოტოების კოლექციის მეშვეობით" },
  { key: "gallery_page_empty_title", en: "Gallery coming soon", ka: "გალერეა მალე" },
  { key: "gallery_page_empty_subtitle", en: "Photos will appear here once uploaded by the admin", ka: "ფოტოები გამოჩნდება აქ ადმინის ატვირთვის შემდეგ" },
  { key: "gallery_page_zoom_label", en: "Click to zoom", ka: "დასადიდებლად დააჭირეთ" },
  { key: "gallery_page_cta_title", en: "Experience Mtiskari in Person", ka: "განიცადეთ მწისქარი პირადად" },
  { key: "gallery_page_cta_desc", en: "These photos capture just a glimpse of what awaits you. Come see the beauty for yourself.", ka: "ეს ფოტოები მხოლოდ ნაწილია იმისა, რაც თქვენ ელოდება. მოდით და ნახეთ სილამაზე თვითონ." },
  { key: "gallery_page_cta_btn", en: "Plan Your Visit", ka: "დაგეგმეთ ვიზიტი" },
  { key: "price_on_request", en: "Price on request", ka: "ფასი მოთხოვნით" },
  { key: "calendar_page_title", en: "Availability Calendar", ka: "ხელმისაწვდომობის კალენდარი" },
  { key: "calendar_page_subtitle", en: "Check available dates before booking", ka: "შეამოწმეთ ხელმისაწვდომი თარიღები დაჯავშნამდე" },
  { key: "select_cottage_label", en: "Select a cottage", ka: "აირჩიეთ კოტეჯი" },
  { key: "all_cottages_label", en: "All cottages", ka: "ყველა კოტეჯი" },
  { key: "booked_label", en: "Not available", ka: "დაკავებულია" },
  { key: "selected_label", en: "Selected", ka: "არჩეული" },
  { key: "available_label", en: "Available", ka: "ხელმისაწვდომი" },
];

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
  ) {}

  async onModuleInit() {
    for (const item of DEFAULT_CONTENT) {
      const exists = await this.contentRepository.findOne({
        where: { key: item.key },
      });
      if (!exists) {
        await this.contentRepository.save(this.contentRepository.create(item));
      }
    }
  }

  async getAll(): Promise<Record<string, { en: string; ka: string }>> {
    const items = await this.contentRepository.find();
    const result: Record<string, { en: string; ka: string }> = {};
    for (const item of items) {
      result[item.key] = { en: item.en || "", ka: item.ka || "" };
    }
    return result;
  }

  async bulkUpdate(updates: Array<{ key: string; en?: string; ka?: string }>) {
    for (const update of updates) {
      let record = await this.contentRepository.findOne({
        where: { key: update.key },
      });
      if (!record) {
        record = this.contentRepository.create({ key: update.key });
      }
      if (update.en !== undefined) record.en = update.en;
      if (update.ka !== undefined) record.ka = update.ka;
      await this.contentRepository.save(record);
    }
    return this.getAll();
  }
}
