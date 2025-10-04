# ☁️ Cloudinary Setup Guide for AquaConnect

## 🎯 Why Cloudinary?

Cloudinary offers several advantages over Firebase Storage:
- ✅ **Better reliability** and faster uploads
- ✅ **Automatic image optimization** (format, quality, size)
- ✅ **Built-in transformations** (resize, crop, filters)
- ✅ **CDN delivery** for faster loading
- ✅ **More generous free tier** (25GB storage, 25GB bandwidth)
- ✅ **Better error handling** and debugging

## 🚀 Setup Steps

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Click **"Sign Up Free"**
3. Create your account
4. Verify your email

### Step 2: Get Your Credentials
1. Go to your [Cloudinary Dashboard](https://console.cloudinary.com/)
2. You'll see your **Account Details**:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (keep this private!)

### Step 3: Create Upload Preset
1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **"Add upload preset"**
4. Configure the preset:
   - **Preset name**: `aquaconnect_reports`
   - **Signing Mode**: **Unsigned** (important for mobile apps)
   - **Folder**: Leave empty (we'll set this programmatically)
   - **Format**: **Auto** (for automatic format optimization)
   - **Quality**: **Auto** (for automatic quality optimization)
   - **Allowed formats**: `jpg,png,jpeg,webp`
   - **Max file size**: `10000000` (10MB)
   - **Max image width**: `2048`
   - **Max image height**: `2048`
   - **Transformation**: 
     ```
     c_limit,w_1024,h_1024,q_auto,f_auto
     ```
   - **Tags**: `aquaconnect,mobile-upload` (optional)
5. Click **"Save"**

### Step 4: Configure Environment Variables
Add these to your `.env` file:

```env
# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=aquaconnect_reports
EXPO_PUBLIC_CLOUDINARY_API_KEY=123456789012345
```

**Replace with your actual values from Step 2!**

### Step 5: Restart Development Server
```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

## 🧪 Test the Setup

1. **Open your app**
2. **Go to Report Screen**
3. **Add some photos**
4. **Submit a report**
5. **Check the console logs** for Cloudinary upload progress
6. **Verify images in Cloudinary Dashboard** under Media Library

## 📊 Cloudinary Dashboard

After successful uploads, you can:
- **View all uploaded images** in Media Library
- **See usage statistics** (storage, bandwidth)
- **Manage images** (delete, transform, organize)
- **Monitor API usage**

## 🔧 Advanced Configuration

### Custom Transformations
You can create custom image transformations:

```javascript
// Example: Create thumbnail versions
const thumbnailUrl = cloudinaryService.getOptimizedImageUrl(publicId, {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto'
});
```

### Upload Presets for Different Use Cases
Create multiple presets for different image types:
- `aquaconnect_reports` - For report images (1024x1024 max)
- `aquaconnect_profiles` - For user avatars (512x512 max)
- `aquaconnect_thumbnails` - For small previews (200x200 max)

## 🛡️ Security Best Practices

### For Production:
1. **Use signed uploads** for sensitive content
2. **Set up upload restrictions** (file size, format)
3. **Configure auto-moderation** for inappropriate content
4. **Set up webhook notifications** for upload events

### Environment Security:
- ✅ Never commit API secrets to version control
- ✅ Use different presets for development/production
- ✅ Regularly rotate API keys
- ✅ Monitor usage and set up alerts

## 🚨 Troubleshooting

### Common Errors:

#### "Invalid cloud name"
- **Fix**: Check `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env`
- **Verify**: Cloud name should match your dashboard

#### "Invalid upload preset"
- **Fix**: Check `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env`
- **Verify**: Preset exists and is **unsigned**

#### "Upload failed: 401"
- **Fix**: Upload preset should be **unsigned**
- **Check**: Preset signing mode in dashboard

#### "Upload failed: 400"
- **Fix**: Check image format and size
- **Try**: Different images or smaller file sizes

#### "Transformation parameter is not allowed"
- **Fix**: Remove transformation from upload code (already fixed)
- **Configure**: Set transformations in upload preset instead
- **Verify**: Upload preset is set to "Unsigned" mode

### Debug Steps:
1. **Check console logs** for detailed error messages
2. **Verify environment variables** are loaded
3. **Test with different images** (smaller files first)
4. **Check Cloudinary dashboard** for failed uploads
5. **Verify upload preset settings**

## 📈 Benefits You'll Get

### Automatic Optimizations:
- **Format optimization** (WebP for modern browsers, JPEG for older)
- **Quality optimization** (reduces file size without visible quality loss)
- **Responsive images** (different sizes for different devices)

### Better User Experience:
- **Faster uploads** (Cloudinary's global CDN)
- **Faster loading** (optimized images)
- **Better error handling** (detailed error messages)
- **Progress tracking** (upload progress indicators)

### Developer Benefits:
- **Easy image transformations** (resize, crop, filters)
- **Detailed analytics** (usage, performance metrics)
- **Webhook support** (for advanced integrations)
- **API-first approach** (easy to integrate anywhere)

## 🎉 You're All Set!

Once configured, your AquaConnect app will:
- ✅ Upload images to Cloudinary instead of Firebase Storage
- ✅ Automatically optimize images for web delivery
- ✅ Provide better error handling and user feedback
- ✅ Organize images in folders by report ID
- ✅ Generate optimized URLs for different use cases

Your images will be stored at URLs like:
`https://res.cloudinary.com/your-cloud-name/image/upload/aquaconnect/reports/report123/image_0_1694123456789.jpg`
