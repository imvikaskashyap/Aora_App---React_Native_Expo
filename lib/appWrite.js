import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.vk.aora",
  projectId: "6700d916001dc0cd9ae6",
  databaseId: "670391e90019cb6c4076",
  userCollectionId: "670391f2000fdbaf3fb5",
  videoCollectionId: "670392550011d842e2d7",
  storageId: "6700dec5002ed0ff41c9",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};

// Login User
export async function signIn(email, password) {
  try {
    // Check if a session already exists
    const currentUser = await account.get();

    // If a session exists, just return the session
    if (currentUser) {
      console.log("User already logged in:", currentUser);
      return currentUser;
    }
  } catch (error) {
    // If no session exists, error will be thrown. Proceed to sign in.
    console.log("No active session, proceeding to login...");
  }

  try {
    // Create a new session if no session is active
    const session = await account.createEmailPasswordSession(email, password);
    console.log("New session created:", session);
    return session;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error(error.message);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc(`$createdAt`)]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc(`$createdAt`, Query.limit(7))]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchVideos = async (query) => {
  try {
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserVideos = async (userId) => {
  try {
    console.log(userId);
    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    console.log(videos.documents);
    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Function to like a video
export const likeVideo = async (userId, videoId) => {
  try {
    // Get the user document

    const user = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      userId
    );


    
    // Step 2: Check if the likedVideos array contains the videoId by comparing the $id property
    const videoExistsInLikedVideos = user.likedVideos.some((video) => video.$id === videoId);

    if(videoExistsInLikedVideos) {
      throw new Error("Video already liked");
    }

    // Add video to user's likedVideos if not already present
    const updatedLikedVideos = [...user.likedVideos, videoId];

    // Update user's likedVideos
    await databases.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userId,
      {
        likedVideos: updatedLikedVideos,
      }
    );
    // Get the video document
    const video = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId
    );

    let videoLikes = video.likes || [];

    const userLike = videoLikes.find((like) => like.$id === userId);

    if (userLike) {
      throw new Error("Video already liked");
    }


    // Add user to the video's likes
    const updatedVideoLikes = [...video.likes, userId];

    // Update video with new like
    await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId,
      {
        likes: updatedVideoLikes,
      }
    );

    console.log("video liked 3");
  } catch (error) {
    console.error("Error liking video:", error);
  }
};

// Function to unlike a video

export const unlikeVideo = async (userId, videoId) => {
  try {
    const user = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      userId
    );

    // Ensure likedVideos exists and is an array
    let likedVideos = user.likedVideos || [];

    // Step 2: Check if the likedVideos array contains the videoId by comparing the $id property
    const videoExistsInLikedVideos = likedVideos.some(
      (video) => video.$id === videoId
    );

    if (videoExistsInLikedVideos) {
      // Step 3: Remove the video from likedVideos by filtering out the video with the matching $id
      likedVideos = likedVideos.filter((video) => video.$id !== videoId);

      // Update user's likedVideos field
      await databases.updateDocument(
        config.databaseId,
        config.userCollectionId,
        userId,
        {
          likedVideos: likedVideos,
        }
      );

      console.log(`Removed videoId ${videoId} from user's likedVideos`);
    } else {
      console.log(`videoId ${videoId} not found in user's likedVideos`);
    }

    // Step 4: Fetch the video document
    const video = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      videoId
    );

    console.log("VIDEO", video);

    // Ensure likes exists and is an array
    let videoLikes = video.likes || [];

    const userLike = videoLikes.find((like) => like.$id === userId);

    if (userLike) {
      // Remove the user from the likes array
      videoLikes = videoLikes.filter((like) => like.$id !== userId);

      // Update video's likes field
      await databases.updateDocument(
        config.databaseId,
        config.videoCollectionId,
        videoId,
        {
          likes: videoLikes,
        }
      );

      console.log(`Removed userId ${userId} from video's likes`);
    } else {
      console.log(`userId ${userId} not found in video's likes`);
    }
  } catch (error) {
    console.error("Error unliking video:", error);
    throw new Error(error); // Throwing the error to propagate it if needed
  }
};





