# TailorTunesGitHub
### Welcome to TailorTunes
TailorTunes is a powerful browser-based music player application that is implemented as part of a bachelor thesis for the University of Ratisbona. 

**Google Chrome recommended**

Link to web application: http://raspbianpi8.no-ip.org/TailorTunesGithub/index.html

Link to GitHub I/O: http://mopat.github.io/TailorTunesGitHub/

**----Working fine with Google Chrome Browser on Desktop, Tablet, Smartphone and Multi-Touch-Tabletop----**
```
$ cd mopat/TailorTunesGithub
$ git fetch origin
$ git checkout gh-pages
```

If you're using the GitHub for Mac, simply sync your repository and you'll see the new branch.

###Functionalities###
* Automatically generate and play playlists with different parameters
* Search by Artist, Track and Genre
* Search and playback a single track
* Save the current playlist in the browser memory
* Save Playlists in your own account
* Load and delete playlists from your account
* Sort your Playlists

### Adaptations and Adjustments
Due to the particularities of a Multi-TouchTabletop it is necessary to make special adaptations of the user interface as the turning of the content and the associated adjustments to the user interface and interaction.
* orientation of content
* width and height of the interaction area
* adjust the used UI-libraries
* adjust scroll function
* adjust sort function (https://github.com/mopat/rotatableSortable)

Browse code and comments for solutions (src/Adaptation/RotationHandler.js)!


[Rotations of TailorTunes](http://raspbianpi8.no-ip.org/TailorTunesGithub/tailortunes_rotations_small.png)

Watch demo video for Tabletop here: [TailorTunes Demo on Samsung SUR40](https://youtu.be/o-0NTzU4aCE)
