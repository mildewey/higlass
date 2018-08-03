Developer
#########

Public API
***********

Creating an inline HiGlass component
------------------------------------

.. code-block:: javascript

  const hgv = hglib.viewer(element, config, options);

Create a new HiGlass viewer within a web page. This initializes a
HiGlassComponent inside the element ``element`` with a viewconfig passed in as
``config``. If ``config`` is a string, it is interpreted as a url and used to
try to fetch a remote viewconfig.

The ``options`` parameter can currently only specify the ``bounded`` property
which tells the HiGlass component to fill all the space in the containing
element. Note that if ``bounded`` is set to true, then ``element`` must have a
fixed height. ``callback`` is used to return an api variable which can be used
to access HiGlass events.

The function returns an instance of the public API of a HiGlass component.

A full example of an inline HiGlass component can be found in the `HiGlass
GitHub repository
<https://github.com/hms-dbmi/higlass/blob/develop/app/api.html>`_.

**Example**

.. code-block:: javascript

  const hgv = hglib.viewer(
    document.getElementById('development-demo'),
    testViewConfig,
    { bounded: true },
  );

**Options**

``bounded: bool [default: true]``
    Don't exceed the bounds of the enclosing element.


``onViewConfLoaded: callback [default: null]``
    Specify a callback to be loaded when the specified viewconf is 
    completely loaded. This is useful when trying calling an API
    function in quick succesion after initializing the viewer.

    Example:

.. code-block:: javascript

  const baseUrl = 'http://higlass.io/api/v1/viewconfs/';
  var hgv = hglib.createHgComponent(
    document.getElementById('development-demo'),
    baseUrl + '?d=KeXl4zLsTP6IKZGpFckuNA',
    {
      bounded: true,
      onViewConfLoaded: zoomTo
    }
  );

  function zoomTo() {
    hgv.zoomTo("aa", 1000000,2000000,1000000,2000000, 1000);
  }
    

Setting the current view config
-------------------------------

The HiGlass API can be used to set a new viewconfig. This returns a Promise
which is fulfilled when all of the data for the view is loaded.

**Prototype**

``setViewConfig(viewconfig)``

**Parameters**

``viewconfig: {...}``
    A JSON object describing the viewconf to use.

**Example**

.. code-block:: javascript

  const p = hgv.setViewConfig(newViewConfig);
  p.then(() => {
    // the initial set of tiles has been loaded
  });

Zooming to show all of the data
-------------------------------

One may set a view config pointing to a dataset which is either out of the
bounds of the view, too small, or too zoomed in. To fit the data inside of
the view, the HiGlass API exposes the  ``zoomToDataExtent`` function.

**Parameters**

``viewUid: string``
    The uid of the view to zoom. The uid of a view can be found in the
    JSON viewconf views section under ``uid``.

.. code-block:: javascript

  hgv.zoomToDataExtent('viewUid');

The passed in ``viewUid`` should refer to a view which is present. If it
doesn't, an exception will be thrown. Note that if this functio is invoked
directly after a HiGlass component is created, the information about the
visible tilesets will not have been retrieved from the server and
``zoomToDataExtent`` will not work as expected. To ensure that the
visible data has been loaded from the server, use the ``setViewConfig``
function and place ``zoomToDataExtent`` in the promise resolution.

Example:

.. code-block:: javascript

    const p = hgv.setViewConfig(newViewConfig);
    p.then(() => {
        hgv.zoomToDataExtent('viewUid');
    });


Zoom to a data location
-----------------------

Change the current view port to a certain data location.  When ``animateTime`` is
greater than 0, animate the transition.

If working with genomic data, a chromosome info file will need to be used in
order to calculate "data" coordinates from chromosome coordinates. "Data"
coordinates are simply the coordinates as if the chromosomes were placed next
to each other.

**Prototype**

``zoomTo(viewUid,start1,end1,start2,end2,animateTime):``

**Parameters**

``viewUid: string``
    The uid of the view to zoom. The uid of a view can be found in the
    JSON viewconf views section under ``uid``.
``start1: Number``
    The left x coordinate of the region to zoom to. 
``end1: Number``
    The right x coordinate of the region to zoom to. 
``start2: Number``
    The left x coordinate of the region to zoom to. 
``end2: Number``
    The right x coordinate of the region to zoom to. 
``animateTime``
    The duration of the zoom transition in milliseconds.

**Example:**

.. code-block:: javascript

  hgv.zoomTo('v1', 1000000,1000000,2000000,2000000, 500);

Select a mouse tool
-------------------

Some tools needs conflicting mouse events such as mousedown or mousemove. To
avoid complicated triggers for certain actions HiGlass supports different mouse
tools for different interactions. The default mouse tool enables pan&zoom. The
only other mouse tool available right now is ``select``, which lets you brush
on to a track to select a range for annotating regions.

**Prototype**

``activateTool(mouseTool)``

**Parameters**

``mouseTool: string [default: '']``
    Select a mouse tool to use. Currently there only 'default' and 'select' are
    available.

**Examples:**

.. code-block:: javascript

  hgv.activateTool('select'); // Select tool is active
  hgv.activateTool(); // Default pan&zoom tool is active

Subscribe to events
-------------------

HiGlass exposes the following event, which one can subscribe to via this method:

- location
- rangeSelection
- viewConfig
- mouseMoveZoom

**Prototype**

``on(event, callback, viewId)``

**Parameters**

``event: string``
    One of the events described below

``callback: function``
    A callback to be called when the event occurs

``viewId: string``
    The view ID to listen to events.

**Event types**

``location:`` Returns an object describing the visible region

.. code-block:: javascript

    {
        xDomain: [1347750580.3773856, 1948723324.787681],
        xRange: [0, 346],
        yDomain: [1856870481.5391564, 2407472678.0075483],
        yRange: [0, 317]
    }


``rangeSelection:`` Returns a BED- (1D) or BEDPE (1d) array of the selected data and genomic range (if chrom-sizes are available)

.. code-block:: javascript

  // Global output
  {
    dataRange: [...]
    genomicRange: [...]
  }

  // 1D data range
  [[1218210862, 1528541001], null]

  // 2D data range
  [[1218210862, 1528541001], [1218210862, 1528541001]]

  // 1D or BED-like array
  [["chr1", 249200621, "chrM", 50000], null]

  // 2D or BEDPE-like array
  [["chr1", 249200621, "chr2", 50000], ["chr3", 197972430, "chr4", 50000]]

``viewConfig:`` Returns the current view config.

``mouseMoveZoom:`` Returns the raw data around the mouse cursors screen location and the related genomic location.

.. code-block:: javascript

  {
    data, // Raw Float32Array
    dim,  // Dimension of the lens (the lens is squared)
    toRgb,  // Current float-to-rgb converter
    center,  // BED array of the cursors genomic location
    xRange,  // BEDPE array of the x genomic range
    yRange,  // BEDPE array of the y genomic range
    rel  // If true the above three genomic locations are relative
  }

**Examples:**

.. code-block:: javascript

  let locationListenerId;
  hgv.on(
    'location',
    location => console.log('Here we are:', location),
    'viewId1',
    listenerId => locationListenerId = listenerId
  );

  const rangeListenerId = hgv.on(
    'rangeSelection',
    range => console.log('Selected', range)
  );

  const viewConfigListenerId = hgv.on(
    'viewConfig',
    range => console.log('Selected', range)
  );

  const mmz = event => console.log('Moved', event);
  hgv.on('mouseMoveZoom', mmz);

Unsubscribe from events
-----------------------

Cancel a subscription.

**Prototype**

``off(event, listenerId, viewId)``

**Examples:**

The variables used in the following examples are coming from the above examples of ``on()``.

.. code-block:: javascript

  hgv.off('location', listener, 'viewId1');
  hgv.off('rangeSelection', rangeListener);
  hgv.off('viewConfig', viewConfigListener);
  hgv.off('mouseMoveZoom', mmz);

Getters for the current HiGlass State
-------------------------------------

Naturally, event listeners only return news once an event has been published but sometimes one needs to get the data at a certain time. The get method returns the current value of an event without having to wait for the event to fire.

HiGlass provides a set of accessors and exporters to retrieve data from HiGlass or to export its state as a viewconf, SVG or PNG:

.. code-block:: javascript

  const currentLocationOfViewId = hgv.getLocation('viewId');
  const currentRangeSelection = hgv.getRangeSelection();
  const currentViewConfig = hgv.exportAsViewConfString();
  const pngSnapshot = hgv.exportAsPng();  // Data URI
  const svgSnapshot = hgv.exportAsSvg();  // XML string

Get sharable link for current view config
-----------------------------------------

Generate a sharable link to the current view config. The `url` parameter should contain
the API endpoint used to export the view link (e.g. 'http://localhost:8989/api/v1/viewconfs').
If it is not provided, the value is taken from the `exportViewUrl` value of the viewconf.

**Prototype**

``shareViewConfigAsLink(url)``

**Example**

.. code-block:: javascript

  hgv.shareViewConfigAsLink()
    .then((sharedViewConfig) => {
      console.log(`Shared view config (ID: ${sharedViewConfig.id}) is available at ${sharedViewConfig.url}`)
    })
    .catch((err) => { console.error('Something did not work. Sorry', err); })

Obtaining ordered chromosome info
---------------------------------

HiGlass provides an API for obtaining information about chromosomes
and the order they are listed in a chromSizes file:

.. code-block:: javascript

    import {ChromosomeInfo} from 'higlass';

    ChromosomeInfo(
      'http://higlass.io/api/v1/chrom-sizes/?id=Ajn_ttUUQbqgtOD4nOt-IA',
      (chromInfo) => {
        console.log('chromInfo:', chromInfo);
      });

This will return a data structure with information about the chromosomes
listed:

.. code-block:: javascript

    {
      chrPositions: {
        chr1 : {id: 0, chr: "chr1", pos: 0},
        chr2 : {id: 1, chr: "chr2", pos: 249250621} ,
        ...
      },
      chromLengths: {
        chr1: "249250621",
        chr2: "243199373",
        ...
      },
      cumPositions: [
        {id: 0, chr: "chr1", pos: 0},
        {id: 1, chr: "chr2", pos: 249250621},
        ...
       ]
    }

Viewconfs
*********

Viewconfs specify exactly what a HiGlass view should show. They contain a list
of the data sources, visualization types, visible region as well as searching
and styling options.

Show a specific genomic location
--------------------------------

Say we want to have a viewconf which was centered on the gene OSR1. Its
location is roughly between positions 19,500,000 and 19,600,000 on chromosome 7
of the hg19 assembly. So what should ``initialXDomain`` be set to in order to
show this gene?

Because ``initialXDomain`` accepts absolute coordinates calculated by
concatenating chromosomes according to a certain order, we need to calculate
what chr2:19,500,000 and chr2:196,000,000 are in absolute coordinates.

To do this we will assume a chromosome ordering consisting of chr1, chr2, ...
This means that we need to take the length of chr1 in hg19, which is
249,250,621 base pairs, and add our positions to that, yielding
positions 268,750,621 and 268,850,621 for the ``initialXDomain``.

The chromosome order commonly used in HiGlass for hg19 can be found in the
`negspy repository
<https://github.com/pkerpedjiev/negspy/blob/master/negspy/data/hg19/chromInfo.txt>`_.

Upload a viewconf to the server
-------------------------------

A local viewconf can be sent to the server by sending a ``POST`` request. Make
sure the actual viewconf is wrapped in the ``viewconf`` section of the posted
json (e.g. `{"viewconf": myViewConfig}`):

.. code-block:: bash

    curl -H "Content-Type: application/json" \
         -X POST \
         -d '{"viewconf": {"editable": true, "zoomFixed": false, "trackSourceServers": ["/api/v2", "http://higlass.io/api/v1"], "exportViewUrl": "/api/v1/viewconfs/", "views": [{"tracks": {"top": [], "left": [], "center": [], "right": [], "bottom": []}, "initialXDomain": [243883495.14563107, 2956116504.854369], "initialYDomain": [804660194.1747572, 2395339805.825243], "layout": {"w": 12, "h": 12, "x": 0, "y": 0, "i": "EwiSznw8ST2HF3CjHx-tCg", "moved": false, "static": false}, "uid": "EwiSznw8ST2HF3CjHx-tCg"}], "zoomLocks": {"locksByViewUid": {}, "locksDict": {}}, "locationLocks": {"locksByViewUid": {}, "locksDict": {}}, "valueScaleLocks": {"locksByViewUid": {}, "locksDict": {}}}}' http://localhost:8989/api/v1/viewconfs/
