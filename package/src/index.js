

const Identicon = (string, options) => {

  if (!string) {
    // throw "Fail";
    return false;
  }
  const hash = md5(string);
  const margin = 0;
  const size = 512;
  const hue = parseInt(hash.substr(-7), 16) / 0xfffffff;
  const saturation = options ? options.saturation : 0.7;
  const brightness = options ? options.brightness : 0.5;
  const rectangles = [];

  const rectangle = (x, y, w, h, color) => {
    rectangles.push({x: x, y: y, w: w, h: h, color: color});
  };  

  const getXML = (fg, bg) =>{
    var i, xml, rect, stroke = size * 0.005;

    xml = "<svg xmlns='http://www.w3.org/2000/svg'"
        + " width='" + size + "' height='" + size + "'"
        + " style='background-color:" + bg + ";'>"
        + "<g style='fill:" + fg + "; stroke:" + fg + "; stroke-width:" + stroke + ";'>";
      
    for (i = 0; i < rectangles.length; i++) {
        rect = rectangles[i];
        if (rect.color == bg) continue;
        xml += "<rect "
            + " x='"      + rect.x + "'"
            + " y='"      + rect.y + "'"
            + " width='"  + rect.w + "'"
            + " height='" + rect.h + "'"
            + "/>";
    }
    xml += "</g></svg>"

    return xml;
  }

  // adapted from: https://gist.github.com/aemkei/1325937
  const hsl2rgb = (h, s, b) => {
    h *= 6;
    s = [
        b += s *= b < .5 ? b : 1 - b,
        b - h % 1 * s * 2,
        b -= s *= 2,
        b,
        b + h % 1 * s,
        b + s
    ];

    return [
        s[ ~~h    % 6 ] * 255, // red
        s[ (h|16) % 6 ] * 255, // green
        s[ (h|8)  % 6 ] * 255  // blue
    ];
  };

  const render = () => {
    const foreground = hsl2rgb(hue, saturation, brightness);
    var image,
        baseMargin = Math.floor(size * margin),
        cell       = Math.floor((size - (baseMargin * 2)) / 5),
        marg     = Math.floor((size - cell * 5) / 2),
        bg         = 'white',
        fg         = 'rgba(' + foreground.join(',') + ')';

    // the first 15 characters of the hash control the pixels (even/odd)
    // they are drawn down the middle first, then mirrored outwards
    var i, color;
    for (i = 0; i < 15; i++) {
        color = parseInt(hash.charAt(i), 16) % 2 ? bg : fg;
        if (i < 5) {
            rectangle(2 * cell + marg, i * cell + marg, cell, cell, color, image);
        } else if (i < 10) {
            rectangle(1 * cell + marg, (i - 5) * cell + marg, cell, cell, color, image);
            rectangle(3 * cell + marg, (i - 5) * cell + marg, cell, cell, color, image);
        } else if (i < 15) {
            rectangle(0 * cell + marg, (i - 10) * cell + marg, cell, cell, color, image);
            rectangle(4 * cell + marg, (i - 10) * cell + marg, cell, cell, color, image);
        }
    }
    return getXML(fg, bg);
  };

  return render();
}

// export default Identicon;
