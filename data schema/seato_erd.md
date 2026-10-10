# SEATO — Entity Relationship Diagram

> [!NOTE]
> Diambil dari [`schema.prisma`](file:///c:/keja/BADAG/seato-mockup/prisma/schema.prisma) — 17 model, PostgreSQL.

---

## ERD Diagram

```mermaid
erDiagram

    User {
        String id PK
        String name
        String email UK
        String password
        String initials
        String location
        Float latitude
        Float longitude
        Int statsReservasi
        Int statsUlasan
        Int statsFavorit
        Int cancelCount
        DateTime bannedUntil
        Int level
        Int xpPoints
        Int cafesVisited
        String bio
        String avatarUrl
        String specialization
        DateTime createdAt
        DateTime updatedAt
    }

    Badge {
        String id PK
        String name UK
        String description
        String iconUrl
        String category
        String requirement
        DateTime createdAt
    }

    UserBadge {
        String id PK
        String userId FK
        String badgeId FK
        DateTime earnedAt
    }

    XPLog {
        String id PK
        String userId FK
        String action
        Int xpAmount
        String sourceId
        DateTime createdAt
    }

    UserFavorite {
        String id PK
        String userId FK
        String restaurantId FK
        DateTime createdAt
    }

    Promo {
        String id PK
        String title
        String subtitle
        String imageUrl
        String color
        String type
        String code
        String restaurantId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Restaurant {
        String id PK
        String name
        String address
        String city
        String distance
        Float latitude
        Float longitude
        String type
        Float rating
        Int reviewsCount
        String status
        String imageUrl
        String tags
        Boolean isTrending
        Boolean isRecommended
        Int mentionsCount
        String loginEmail UK
        String loginPassword
        DateTime createdAt
        DateTime updatedAt
    }

    RestaurantArea {
        String id PK
        String restaurantId FK
        String name
        Int total
        Int seatoAllocated
        Int seatoOccupied
        Int walkInOccupied
        Json tableAssignments
    }

    Reservation {
        String id PK
        String userId FK
        String restaurantId FK
        String status
        String date
        String time
        Int guests
        String tableType
        String areaId FK
        String assignedTable
        String invoiceId UK
        Int totalAmount
        String paymentStatus
        String cancelReason
        String cancelledBy
        String promoId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Review {
        String id PK
        String userId FK
        String restaurantId FK
        String reservationId FK_UK
        Int rating
        String comment
        DateTime createdAt
        DateTime updatedAt
    }

    Stream {
        String id PK
        String authorName
        String authorAvatar
        String type
        String content
        Int rating
        String imageUrl
        Int likes
        String restaurantId FK
        String parentId FK
        DateTime createdAt
        DateTime updatedAt
    }

    MerchantVisitorLog {
        String id PK
        String restaurantId FK
        String userId FK
        String action
        String keyword
        String source
        String device
        DateTime createdAt
    }

    MerchantAiInsight {
        String id PK
        String restaurantId FK
        String period
        String summaryText
        Float sentimentScore
        Json peakHoursJson
        Json topKeywords
        Json actionItems
        Int churnRiskCount
        Json rawMetrics
        DateTime createdAt
    }

    ScrapedMarketData {
        String id PK
        String restaurantId FK
        String targetName
        String platform
        Json scrapedData
        Float rating
        Int reviewCount
        DateTime createdAt
    }

    MerchantNotificationConfig {
        String id PK
        String restaurantId FK_UK
        String emailRecipient
        String waRecipient
        Boolean enableEmail
        Boolean enableWA
        String frequency
        DateTime createdAt
        DateTime updatedAt
    }

    Community {
        String id PK
        String name
        String category
        String description
        String logoUrl
        String picUserId FK
        String verificationStatus
        String verificationNote
        DateTime createdAt
        DateTime updatedAt
    }

    CommunityMember {
        String id PK
        String communityId FK
        String userId FK
        String role
        DateTime joinedAt
    }

    CommunityEvent {
        String id PK
        String communityId FK
        String restaurantId FK
        String submittedById FK
        String title
        String activityType
        String eventType
        String date
        String time
        Int targetCapacity
        Int currentRsvp
        Json requestChips
        String customNote
        String merchantReply
        String status
        Boolean isFlaggedByAdmin
        DateTime createdAt
        DateTime updatedAt
    }

    CommunityEventRsvp {
        String id PK
        String eventId FK
        String userId FK
        String status
        DateTime createdAt
    }

    %% ─── RELATIONSHIPS ───

    User ||--o{ UserBadge : "has badges"
    Badge ||--o{ UserBadge : "awarded to"

    User ||--o{ XPLog : "earns XP"

    User ||--o{ UserFavorite : "favorites"
    Restaurant ||--o{ UserFavorite : "favorited by"

    User ||--o{ Reservation : "makes"
    Restaurant ||--o{ Reservation : "receives"
    RestaurantArea ||--o{ Reservation : "assigned to"
    Promo ||--o{ Reservation : "applied to"

    Reservation ||--o| Review : "has review"
    User ||--o{ Review : "writes"
    Restaurant ||--o{ Review : "reviewed by"

    Restaurant ||--o{ Promo : "offers"
    Restaurant ||--o{ RestaurantArea : "has areas"
    Restaurant ||--o{ Stream : "tagged in"

    Stream ||--o{ Stream : "replies"

    Restaurant ||--o{ MerchantVisitorLog : "tracked by"
    User ||--o{ MerchantVisitorLog : "visits"

    Restaurant ||--o{ MerchantAiInsight : "analyzed by"
    Restaurant ||--o{ ScrapedMarketData : "scraped for"
    Restaurant ||--|| MerchantNotificationConfig : "configured with"

    User ||--o{ Community : "PIC of"
    Community ||--o{ CommunityMember : "has members"
    User ||--o{ CommunityMember : "member of"

    Community ||--o{ CommunityEvent : "hosts"
    Restaurant ||--o{ CommunityEvent : "venue for"
    User ||--o{ CommunityEvent : "submitted by"

    CommunityEvent ||--o{ CommunityEventRsvp : "has RSVPs"
    User ||--o{ CommunityEventRsvp : "RSVPs to"
```

---

## Ringkasan Model (17 Total)

| # | Model | Deskripsi | Relasi Utama |
|---|-------|-----------|--------------|
| 1 | **User** | Pengguna app | → Reservation, Review, Badge, XP, Favorite, Community |
| 2 | **Badge** | Achievement / lencana | ← UserBadge |
| 3 | **UserBadge** | Junction user×badge | User ↔ Badge |
| 4 | **XPLog** | Log perolehan XP | → User |
| 5 | **UserFavorite** | Favorit user×resto | User ↔ Restaurant |
| 6 | **Promo** | Promo global / kolaborasi | → Restaurant, → Reservation |
| 7 | **Restaurant** | Merchant / café | Hub utama — area, reservasi, review, stream, AI, dll |
| 8 | **RestaurantArea** | Zona tempat duduk (indoor/outdoor) | → Restaurant, → Reservation |
| 9 | **Reservation** | Reservasi meja | User → Restaurant, Area, Promo |
| 10 | **Review** | Ulasan setelah reservasi | User → Restaurant, 1:1 Reservation |
| 11 | **Stream** | Social feed (review/promo/post) | → Restaurant, self-ref replies |
| 12 | **MerchantVisitorLog** | Telemetri pengunjung | → Restaurant, → User |
| 13 | **MerchantAiInsight** | Rangkuman AI buat merchant | → Restaurant |
| 14 | **ScrapedMarketData** | Data scraping kompetitor | → Restaurant |
| 15 | **MerchantNotificationConfig** | Konfigurasi notifikasi merchant | 1:1 Restaurant |
| 16 | **Community** | Komunitas olahraga/hobi | → User (PIC), → Member, → Event |
| 17 | **CommunityMember** | Anggota komunitas | Community ↔ User |
| 18 | **CommunityEvent** | Event komunitas di venue | Community → Restaurant, User |
| 19 | **CommunityEventRsvp** | RSVP user ke event | CommunityEvent ↔ User |

> [!TIP]
> Total **19 model** (terkoreksi). Entitas inti: **User**, **Restaurant**, **Community** — ketiga hub ini menghubungkan hampir semua tabel lain.

---

## Constraint & Index Highlights

| Constraint | Tabel | Kolom |
|-----------|-------|-------|
| `@@unique` | UserBadge | `[userId, badgeId]` |
| `@@unique` | UserFavorite | `[userId, restaurantId]` |
| `@@unique` | CommunityMember | `[communityId, userId]` |
| `@@unique` | CommunityEventRsvp | `[eventId, userId]` |
| `@unique` | Reservation | `invoiceId` |
| `@unique` | Review | `reservationId` |
| `@unique` | Restaurant | `loginEmail` |
| `@unique` | MerchantNotificationConfig | `restaurantId` |
| `@@index` | MerchantVisitorLog | `[restaurantId, createdAt]` |
| `@@index` | MerchantAiInsight | `[restaurantId, createdAt]` |
| `@@index` | Community | `[category, verificationStatus]` |
| `@@index` | CommunityEvent | `[restaurantId, status]`, `[date, status]` |

---

## Cascade / OnDelete Rules

| Tabel | FK | OnDelete |
|-------|-----|---------|
| MerchantVisitorLog | `restaurantId` | **Cascade** |
| MerchantVisitorLog | `userId` | **SetNull** |
| MerchantAiInsight | `restaurantId` | **Cascade** |
| ScrapedMarketData | `restaurantId` | **SetNull** |
| MerchantNotificationConfig | `restaurantId` | **Cascade** |
| CommunityMember | `communityId` | **Cascade** |
| CommunityMember | `userId` | **Cascade** |
| CommunityEvent | `communityId` | **Cascade** |
| CommunityEvent | `restaurantId` | **Cascade** |
| CommunityEventRsvp | `eventId` | **Cascade** |
| CommunityEventRsvp | `userId` | **Cascade** |
