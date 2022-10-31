import axios from 'axios';
import {jsonPath} from "../utils/jsonPath";

export const youtubeScraper = async (ytChannel, query, key, pageToken) => {
    return new Promise((resolve, reject) => {
        let json = {results: [], version: '1.0'};

        if (key) {
            json["parser"] = "json_format.page_token";
            json["key"] = key;
            const searchPath = ytChannel ? 'browse' : 'search';

            // Access YouTube search API
            axios.post(`https://www.youtube.com/youtubei/v1/${searchPath}?key=${key}`, {
                json: {
                    context: {
                        client: {
                            clientName: "WEB",
                            clientVersion: "2.20201022.01.01",
                        },
                    },
                    continuation: pageToken
                },
            }, {
                withCredentials: false,
                responseType: 'json',
            }).then((response) => {
                if (response.status === 200) {
                    parseJsonFormat(response.data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems, json);
                    return resolve(json);
                }
            }).catch((error) => {
                //TODO
                resolve({error: error});
                console.error(error);
            });
        }
        else {
            let url, dataXPath
            if (ytChannel) {
                const pathEnding = query ? `search?query=${encodeURIComponent(query)}` : 'videos';
                url = `https://www.youtube.com/c/${ytChannel}/${pathEnding}`;
                dataXPath = query
                    ? 'contents.twoColumnBrowseResultsRenderer.tabs[6].expandableTabRenderer.content.sectionListRenderer.contents'
                    : 'contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items';
            } else {
                url = `https://www.youtube.com/results?q=${encodeURIComponent(query)}`;
                dataXPath = 'contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents';
            }

            // Access YouTube search
            axios.get(url).then((response) => {
                // Check for errors
                if (response.status === 200) {
                    const html = response.data;
                    json["parser"] = "json_format";
                    json["key"] = html.match(/"innertubeApiKey":"([^"]*)/)[1];

                    // Get script json data from html to parse
                    let data, sectionLists = [];
                    try {
                        let match = html.match(/ytInitialData[^{]*(.*?);\s*<\/script>/s);
                        if (match && match.length > 1) {
                            json["parser"] += ".object_var";
                        } else {
                            json["parser"] += ".original";
                            match = html.match(/ytInitialData"[^{]*(.*);\s*window\["ytInitialPlayerResponse"\]/s);
                        }
                        data = JSON.parse(match[1]);
                        sectionLists = jsonPath(data, dataXPath);
                    } catch (ex) {
                        console.error("Failed to parse data:", ex);
                        console.log(data);
                    }

                    if(!sectionLists) {
                        resolve({error: `No such property '${dataXPath}' in json`});
                    }

                    // Loop through all objects and parse data according to type
                    parseJsonFormat(...sectionLists, json);

                    return resolve(json);
                }
                resolve({error: `Status code is not OK! GET '${url}' status: ${response.statusText}`});
            }).catch((error) => {
                resolve({error: `Failed to GET '${url}': ${error}`});
            });
        }
    });
};

/**
 * Parse youtube search results from json sectionList array and add to json result object
 * @param {Array} contents - The array of sectionLists
 * @param {Object} json - The object being returned to caller
 */
function parseJsonFormat(contents, json) {
    contents.forEach(sectionList => {
        try {
            if (sectionList.hasOwnProperty("itemSectionRenderer")) {
                sectionList.itemSectionRenderer.contents.forEach(content => {
                    try {
                        if (content.hasOwnProperty("channelRenderer")) {
                            json.results.push(parseChannelRenderer(content.channelRenderer));
                        }
                        if (content.hasOwnProperty("videoRenderer") || content.hasOwnProperty("gridVideoRenderer")) {
                            json.results.push(parseVideoRenderer(content.videoRenderer));
                        }
                        if (content.hasOwnProperty("radioRenderer")) {
                            json.results.push(parseRadioRenderer(content.radioRenderer));
                        }
                        if (content.hasOwnProperty("playlistRenderer")) {
                            json.results.push(parsePlaylistRenderer(content.playlistRenderer));
                        }
                    } catch (ex) {
                        console.error("Failed to parse renderer:", ex);
                        console.log(content);
                    }
                });
            } else if (sectionList.hasOwnProperty("continuationItemRenderer")) {
                json["nextPageToken"] = sectionList.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            } else if (sectionList.hasOwnProperty("gridVideoRenderer")) {
                json.results.push(parseVideoRenderer(sectionList.gridVideoRenderer));
            }
        } catch (ex) {
            console.error("Failed to read contents for section list:", ex);
            console.log(sectionList);
        }
    });
}

/**
 * Parse a channelRenderer object from youtube search results
 * @param {object} renderer - The channel renderer
 * @returns object with data to return for this channel
 */
function parseChannelRenderer(renderer) {
    let channel = {
        "id": renderer.channelId,
        "title": renderer.title.simpleText,
        "url": `https://www.youtube.com${renderer.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
        "snippet": renderer.descriptionSnippet ? renderer.descriptionSnippet.runs.reduce(comb, "") : "",
        "thumbnail_src": renderer.thumbnail.thumbnails[renderer.thumbnail.thumbnails.length - 1].url,
        "video_count": renderer.videoCountText ? renderer.videoCountText.runs.reduce(comb, "") : "",
        "subscriber_count": renderer.subscriberCountText ? renderer.subscriberCountText.simpleText : "0 subscribers",
        "verified": renderer.ownerBadges &&
            renderer.ownerBadges.some(badge => badge.metadataBadgeRenderer.style.indexOf("VERIFIED") > -1) ||
            false
    };

    return {channel};
}

/**
 * Parse a playlistRenderer object from youtube search results
 * @param {object} renderer - The playlist renderer
 * @returns object with data to return for this playlist
 */
function parsePlaylistRenderer(renderer) {
    let thumbnails = renderer.thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail.thumbnails;
    let playlist = {
        "id": renderer.playlistId,
        "title": renderer.title.simpleText,
        "url": `https://www.youtube.com${renderer.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
        "thumbnail_src": thumbnails[thumbnails.length - 1].url,
        "video_count": renderer.videoCount
    };

    let uploader = {
        "username": renderer.shortBylineText.runs[0].text,
        "url": `https://www.youtube.com${renderer.shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url}`
    };

    return {playlist: playlist, uploader: uploader};
}

/**
 * Parse a radioRenderer object from youtube search results
 * @param {object} renderer - The radio renderer
 * @returns object with data to return for this mix
 */
function parseRadioRenderer(renderer) {
    let radio = {
        "id": renderer.playlistId,
        "title": renderer.title.simpleText,
        "url": `https://www.youtube.com${renderer.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
        "thumbnail_src": renderer.thumbnail.thumbnails[renderer.thumbnail.thumbnails.length - 1].url,
        "video_count": renderer.videoCountText.runs.reduce(comb, "")
    };

    let uploader = {
        "username": renderer.shortBylineText ? renderer.shortBylineText.simpleText : "YouTube"
    };

    return {radio: radio, uploader: uploader};
}

/**
 * Parse a videoRenderer object from youtube search results
 * @param {object} renderer - The video renderer
 * @returns object with data to return for this video
 */
function parseVideoRenderer(renderer) {
    let video = {
        "id": renderer.videoId,
        "title": renderer.title.runs.reduce(comb, ""),
        "url": `https://www.youtube.com${renderer.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
        "duration": renderer.lengthText ? renderer.lengthText.simpleText : "Live",
        "snippet": renderer.descriptionSnippet ?
            renderer.descriptionSnippet.runs.reduce((a, b) => a + (b.bold ? `<b>${b.text}</b>` : b.text), "") :
            "",
        "upload_date": renderer.publishedTimeText ? renderer.publishedTimeText.simpleText : "Live",
        "thumbnail_src": renderer.thumbnail.thumbnails[renderer.thumbnail.thumbnails.length - 1].url,
        "views": renderer.viewCountText ?
            renderer.viewCountText.simpleText || renderer.viewCountText.runs.reduce(comb, "") :
            (renderer.publishedTimeText ? "0 views" : "0 watching")
    };

    let uploader = {
        "username": renderer.ownerText?.runs[0]?.text,
        "url": `https://www.youtube.com${renderer.ownerText?.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url}`
    };
    uploader.verified = renderer.ownerBadges?.some(badge => badge.metadataBadgeRenderer.style.indexOf("VERIFIED") > -1) || false;

    return {video: video, uploader: uploader};
}

/**
 * Combine array containing objects in format { text: "string" } to a single string
 * For use with reduce function
 * @param {string} a - Previous value
 * @param {object} b - Current object
 * @returns Previous value concatenated with new object text
 */
function comb(a, b) {
    return a + b.text;
}
