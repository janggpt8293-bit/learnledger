/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: articles
 * Interface for Articles
 */
export interface Articles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  metaDescription?: string;
  /** @wixFieldType text */
  tags?: string;
  /** @wixFieldType text */
  articleTitle?: string;
  /** @wixFieldType text */
  mainContent?: string;
  /** @wixFieldType text */
  topicCategory?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
  /** @wixFieldType date */
  publishDate?: Date | string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType url */
  videoUrl?: string;
  /** @wixFieldType text */
  contentType?: string;
}


/**
 * Collection ID: contactsubmissions
 * Interface for ContactSubmissions
 */
export interface ContactSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderName?: string;
  /** @wixFieldType text */
  senderEmail?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType text */
  messageContent?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: learningprogress
 * Interface for LearningProgress
 */
export interface LearningProgress {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  goalName?: string;
  /** @wixFieldType number */
  progressPercentage?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType date */
  targetDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
}
