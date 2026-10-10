## Table `User`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `name` | `text` |  |
| `email` | `text` |  |
| `initials` | `text` |  Nullable |
| `location` | `text` |  Nullable |
| `latitude` | `float8` |  Nullable |
| `longitude` | `float8` |  Nullable |
| `statsReservasi` | `int4` |  |
| `statsUlasan` | `int4` |  |
| `statsFavorit` | `int4` |  |
| `cancelCount` | `int4` |  |
| `bannedUntil` | `timestamp` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |
| `password` | `text` |  Nullable |
| `avatarUrl` | `text` |  Nullable |
| `bio` | `text` |  Nullable |
| `cafesVisited` | `int4` |  |
| `level` | `int4` |  |
| `specialization` | `text` |  Nullable |
| `xpPoints` | `int4` |  |

## Table `Promo`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `title` | `text` |  |
| `subtitle` | `text` |  |
| `imageUrl` | `text` |  |
| `color` | `text` |  |
| `type` | `text` |  |
| `code` | `text` |  Nullable |
| `restaurantId` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `Restaurant`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `name` | `text` |  |
| `address` | `text` |  |
| `city` | `text` |  |
| `distance` | `text` |  Nullable |
| `latitude` | `float8` |  Nullable |
| `longitude` | `float8` |  Nullable |
| `type` | `text` |  |
| `rating` | `float8` |  |
| `reviewsCount` | `int4` |  |
| `status` | `text` |  |
| `imageUrl` | `text` |  Nullable |
| `tags` | `text` |  |
| `isTrending` | `bool` |  |
| `isRecommended` | `bool` |  |
| `loginEmail` | `text` |  Nullable |
| `loginPassword` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |
| `mentionsCount` | `int4` |  |

## Table `RestaurantArea`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `restaurantId` | `text` |  |
| `name` | `text` |  |
| `total` | `int4` |  |
| `seatoAllocated` | `int4` |  |
| `seatoOccupied` | `int4` |  |
| `walkInOccupied` | `int4` |  |
| `tableAssignments` | `jsonb` |  Nullable |

## Table `Reservation`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `userId` | `text` |  |
| `restaurantId` | `text` |  |
| `status` | `text` |  |
| `date` | `text` |  |
| `time` | `text` |  |
| `guests` | `int4` |  |
| `tableType` | `text` |  |
| `areaId` | `text` |  Nullable |
| `invoiceId` | `text` |  Nullable |
| `totalAmount` | `int4` |  Nullable |
| `paymentStatus` | `text` |  Nullable |
| `cancelReason` | `text` |  Nullable |
| `cancelledBy` | `text` |  Nullable |
| `promoId` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |
| `assignedTable` | `text` |  Nullable |

## Table `Review`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `userId` | `text` |  |
| `restaurantId` | `text` |  |
| `reservationId` | `text` |  Nullable |
| `rating` | `int4` |  |
| `comment` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `Stream`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `authorName` | `text` |  |
| `authorAvatar` | `text` |  Nullable |
| `type` | `text` |  |
| `content` | `text` |  |
| `rating` | `int4` |  Nullable |
| `imageUrl` | `text` |  Nullable |
| `likes` | `int4` |  |
| `restaurantId` | `text` |  Nullable |
| `parentId` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `Badge`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `name` | `text` |  |
| `description` | `text` |  |
| `iconUrl` | `text` |  Nullable |
| `category` | `text` |  |
| `requirement` | `text` |  |
| `createdAt` | `timestamp` |  |

## Table `UserBadge`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `userId` | `text` |  |
| `badgeId` | `text` |  |
| `earnedAt` | `timestamp` |  |

## Table `XPLog`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `userId` | `text` |  |
| `action` | `text` |  |
| `xpAmount` | `int4` |  |
| `sourceId` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |

## Table `UserFavorite`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `userId` | `text` |  |
| `restaurantId` | `text` |  |
| `createdAt` | `timestamp` |  |

## Table `MerchantVisitorLog`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `restaurantId` | `text` |  |
| `userId` | `text` |  Nullable |
| `action` | `text` |  |
| `keyword` | `text` |  Nullable |
| `source` | `text` |  Nullable |
| `device` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |

## Table `MerchantAiInsight`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `restaurantId` | `text` |  |
| `period` | `text` |  |
| `summaryText` | `text` |  |
| `sentimentScore` | `float8` |  Nullable |
| `peakHoursJson` | `jsonb` |  Nullable |
| `topKeywords` | `jsonb` |  Nullable |
| `actionItems` | `jsonb` |  Nullable |
| `churnRiskCount` | `int4` |  |
| `rawMetrics` | `jsonb` |  Nullable |
| `createdAt` | `timestamp` |  |

## Table `ScrapedMarketData`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `restaurantId` | `text` |  Nullable |
| `targetName` | `text` |  |
| `platform` | `text` |  |
| `scrapedData` | `jsonb` |  |
| `rating` | `float8` |  Nullable |
| `reviewCount` | `int4` |  Nullable |
| `createdAt` | `timestamp` |  |

## Table `MerchantNotificationConfig`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `restaurantId` | `text` |  |
| `emailRecipient` | `text` |  Nullable |
| `waRecipient` | `text` |  Nullable |
| `enableEmail` | `bool` |  |
| `enableWA` | `bool` |  |
| `frequency` | `text` |  |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `Community`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `name` | `text` |  |
| `category` | `text` |  |
| `description` | `text` |  Nullable |
| `logoUrl` | `text` |  Nullable |
| `picUserId` | `text` |  |
| `verificationStatus` | `text` |  |
| `verificationNote` | `text` |  Nullable |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `CommunityMember`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `communityId` | `text` |  |
| `userId` | `text` |  |
| `role` | `text` |  |
| `joinedAt` | `timestamp` |  |

## Table `CommunityEvent`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `communityId` | `text` |  |
| `restaurantId` | `text` |  |
| `submittedById` | `text` |  |
| `title` | `text` |  |
| `activityType` | `text` |  |
| `eventType` | `text` |  |
| `date` | `text` |  |
| `time` | `text` |  |
| `targetCapacity` | `int4` |  |
| `currentRsvp` | `int4` |  |
| `requestChips` | `jsonb` |  Nullable |
| `customNote` | `text` |  Nullable |
| `merchantReply` | `varchar` |  Nullable |
| `status` | `text` |  |
| `isFlaggedByAdmin` | `bool` |  |
| `createdAt` | `timestamp` |  |
| `updatedAt` | `timestamp` |  |

## Table `CommunityEventRsvp`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `eventId` | `text` |  |
| `userId` | `text` |  |
| `status` | `text` |  |
| `createdAt` | `timestamp` |  |

