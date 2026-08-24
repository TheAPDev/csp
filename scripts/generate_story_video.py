import os
import numpy as np
import imageio.v3 as iio

out = os.path.join('src', 'assets', 'video', 'intro-story-loop.mp4')
os.makedirs(os.path.dirname(out), exist_ok=True)

h, w = 1080, 1920
fps = 24
frames = []

for i in range(fps * 6):
    t = i / fps
    img = np.full((h, w, 3), (13, 29, 61), dtype=np.float32)
    yy, xx = np.mgrid[:h, :w]
    dist = ((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2
    vignette = np.clip(1 - dist * 0.75, 0, 1)
    img = img * vignette[:, :, None]

    sweep = np.sin((yy / 35) + (t * 2.3)) * 18
    img[:, :, 0] += sweep
    img[:, :, 1] += sweep * 0.8
    img[:, :, 2] += sweep * 1.1

    cx, cy = w / 2, h / 2
    rr = ((xx - cx) ** 2 + (yy - cy) ** 2) ** 0.5
    glow = np.exp(-((rr - 180) ** 2) / (2 * (330 ** 2)))
    img[:, :, 0] += glow * 40
    img[:, :, 1] += glow * 50
    img[:, :, 2] += glow * 65

    img = np.clip(img, 0, 255).astype(np.uint8)
    frames.append(img)

stacked = np.stack(frames)
iio.imwrite(out, stacked, fps=fps, quality=8, codec='libx264')
print('CREATED', out)
