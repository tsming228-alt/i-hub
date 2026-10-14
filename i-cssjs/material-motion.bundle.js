/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */
var Axis;
(function (Axis) {
    Axis["X"] = "x";
    Axis["Y"] = "y";
    Axis["ALL"] = "all";
})(Axis || (Axis = {}));
var Axis$1 = Axis;


var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["LEFT"] = "left";
    Direction["RIGHT"] = "right";
})(Direction || (Direction = {}));
var Direction$1 = Direction;


var GestureRecognitionState;
(function (GestureRecognitionState) {
    GestureRecognitionState["POSSIBLE"] = "possible";
    GestureRecognitionState["BEGAN"] = "began";
    GestureRecognitionState["CHANGED"] = "changed";
    GestureRecognitionState["ENDED"] = "ended";
    GestureRecognitionState["RECOGNIZED"] = "ended";
    GestureRecognitionState["CANCELLED"] = "cancelled";
    GestureRecognitionState["FAILED"] = "failed";
})(GestureRecognitionState || (GestureRecognitionState = {}));
var GestureRecognitionState$1 = GestureRecognitionState;


var State;
(function (State) {
    State["AT_REST"] = "at_rest";
    State["ACTIVE"] = "active";
})(State || (State = {}));
var State$1 = State;


var ThresholdRegion;
(function (ThresholdRegion) {
    ThresholdRegion["ABOVE"] = "above";
    ThresholdRegion["WITHIN"] = "within";
    ThresholdRegion["BELOW"] = "below";
})(ThresholdRegion || (ThresholdRegion = {}));
var ThresholdRegion$1 = ThresholdRegion;



/** @license for symbol-observable
 *  The MIT License (MIT)
 *
 *  Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
 *  Copyright (c) Ben Lesh <ben@benlesh.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var $observable = symbolObservablePonyfill(root);


/**
 * Checks if an object is a Boolean.
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Checks if an object is not undefined.
 */
function isDefined(value) {
    return typeof value !== 'undefined';
}
/**
 * Checks if an object has numeric values for both `width` and `height`.
 */
function isDimensions(value) {
    return typeof value.width === 'number' && typeof value.height === 'number';
}
/**
 * Checks if an object is a Number.
 */
function isNumber(value) {
    return typeof value === 'number';
}
/**
 * Checks if an object is an observable by checking if it returns itself from
 * [Symbol.observable]()
 */
function isObservable(value) {
    return value && value[$observable] && value === value[$observable]();
}
/**
 * Checks if an object is a `Map` using `instanceof`.
 */
function isMap(value) {
    return value instanceof Map;
}
/**
 * Checks if an object has numeric values for both `x` and `y`.
 */
function isPoint2D(value) {
    return typeof value.x === 'number' && typeof value.y === 'number';
}
/**
 * Checks if a value is an `Observer` by checking if the value has a `next`
 * method.
 */
function isObserver(value) {
    return typeof value.next === 'function';
}
/**
 * Checks if a value is a `PointerEvent` by checking if the value is an `Event`
 * whose `type` starts with `pointer`.
 *
 * This is useful for ensuring that `downEvent.target.setPointerCapture()` can
 * be called:  To avoid using the PointerEvent polyfill, a developer could
 * create an object that had the subset of `PointerEvent` that we care about
 * (`PartialPointerEvent`) and populate its values from `event.targetTouches`.
 * However, we only need to call `setPointerCapture()` on a true `PointerEvent`,
 * so `isPointerEvent(value)` needs to be able to distinguish between them.
 */
function isPointerEvent(value) {
    return value instanceof Event && value.type.startsWith('pointer');
}
/**
 * Checks if value is iterable; that is, usable in a `for of` loop.
 */
function isIterable(value) {
    return value && value[Symbol.iterator] !== undefined;
}
/**
 * Checks if value has a timestamp property.
 */
function isTimestamped(value) {
    return value && value.hasOwnProperty('timestamp');
}


/**
 * TypeScript is a pain to use with polymorphic types unless you wrap them in a
 * function that returns a single type.  So, that's what this is.
 *
 * If you give it an observer, you get back that observer.  If you give it an
 * anonymous function, you get back that anonymous function wrapped in an
 * observer.
 */
function wrapWithObserver(listener) {
    if (typeof listener === 'function') {
        return {
            next: listener
        };
    }
    else {
        return listener;
    }
}


/**
 * A `MemorylessIndefiniteSubject` is both an `Observer` and an `Observable`.
 * Whenever it receives a value on `next`, it forwards that value to any
 * subscribed observers.
 */
class MemorylessIndefiniteSubject {
    constructor() {
        // Keep track of all the observers who have subscribed, so we can notify them
        // when we get new values.  Note: JavaScript's Set collection is ordered.
        this._observers = new Set();
    }
    /**
     * Passes the supplied value to any currently-subscribed observers.
     */
    next(value) {
        // The parent stream has emitted a value, so pass it along to all the
        // children, and cache it for any observers that subscribe before the next
        // emission.
        this._observers.forEach((observer) => observer.next(value));
    }
    /**
     * `subscribe` accepts either a function, or an object with a `next` method.
     * `subject.next` will forward any value it receives to the function or method
     * provided here.
     *
     * Call the returned `unsubscribe` method to stop receiving values on this
     * particular observer.
     */
    subscribe(observerOrNext) {
        const observer = wrapWithObserver(observerOrNext);
        this._observers.add(observer);
        return {
            unsubscribe: () => {
                this._observers.delete(observer);
            }
        };
    }
    /**
     * Tells other libraries that know about observables that we are one.
     *
     * https://github.com/tc39/proposal-observable#observable
     */
    [$observable]() {
        return this;
    }
}


/**
 * An `IndefiniteSubject` is both an `Observer` and an `Observable`.  Whenever
 * it receives a value on `next`, it forwards that value to any subscribed
 * observers.
 *
 * `IndefiniteSubject` also remembers the most recent emission and passes it to
 * any new subscriber.
 */
class IndefiniteSubject extends MemorylessIndefiniteSubject {
    constructor() {
        super(...arguments);
        this._hasStarted = false;
    }
    /**
     * Passes the supplied value to any currently-subscribed observers.  If an
     * observer `subscribe`s before `next` is called again, it will immediately
     * receive `value`.
     */
    next(value) {
        this._hasStarted = true;
        this._lastEmission = value;
        super.next(value);
    }
    /**
     * `subscribe` accepts either a function or an object with a next method.
     * `subject.next` will forward any value it receives to the function or method
     * provided here.
     *
     * Call the returned `unsubscribe` method to stop receiving values on this
     * particular observer.
     */
    subscribe(observerOrNext) {
        const subscription = super.subscribe(observerOrNext);
        if (this._hasStarted) {
            isObserver(observerOrNext)
                ? observerOrNext.next(this._lastEmission)
                : observerOrNext(this._lastEmission);
        }
        return subscription;
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}


function withAddedBy(superclass) {
    return class extends superclass {
        addedBy(_a) {
            var { value$ } = _a, reactiveMapOptions = __rest(_a, ["value$"]);
            if (!isDefined(value$)) {
                value$ = arguments[0];
            }
            return this._mathOperator(Object.assign({ operation: (upstream, value) => upstream + value, value$ }, reactiveMapOptions));
        }
    };
}


function withAppendUnit(superclass) {
    return class extends superclass {
        appendUnit({ unit }) {
            if (!isDefined(unit)) {
                unit = arguments[0];
            }
            return this._map({
                transform: (value) => value + unit
            });
        }
    };
}


function withClampTo(superclass) {
    return class extends superclass {
        clampTo({ min$, max$ }) {
            return this._mathOperator({
                operation: (upstream, min) => isDefined(min)
                    ? Math.max(upstream, min)
                    : upstream,
                value$: min$,
            })._mathOperator({
                operation: (upstream, max) => isDefined(max)
                    ? Math.min(upstream, max)
                    : upstream,
                value$: max$,
            });
        }
    };
}

/** @license for fast-equals
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2017 Tony Quetano
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 * @constant {boolean} HAS_MAP_SUPPORT
 */
var HAS_MAP_SUPPORT = typeof Map === 'function';
/**
 * @constant {boolean} HAS_SET_SUPPORT
 */

var HAS_SET_SUPPORT = typeof Set === 'function';
/**
 * @constant {boolean} HAS_WEAKSET_SUPPORT
 */

var HAS_WEAKSET_SUPPORT = typeof WeakSet === 'function';

// constants
var keys = Object.keys;
/**
 * @function addObjectToCache
 *
 * @description
 * add object to cache if it is indeed an object
 *
 * @param {any} object the object to potentially add to the cache
 * @param {Object|WeakSet} cache the cache to add to
 * @returns {void}
 */

var addObjectToCache = function addObjectToCache(object, cache) {
  return object && typeof object === 'object' && cache.add(object);
};
/**
 * @function hasItem
 *
 * @description
 * does the array include the item passed
 *
 * @param {Array<any>} array the array to check in
 * @param {any} item the item to locate
 * @param {function} isEqual the equality comparator
 * @param {any} meta the meta item to pass through
 * @returns {boolean} does the item exist in the array
 */

var hasItem = function hasItem(array, item, isEqual, meta) {
  for (var index = 0; index < array.length; index++) {
    if (isEqual(array[index], item, meta)) {
      return true;
    }
  }

  return false;
};
/**
 * @function hasItems
 *
 * @description
 * are the arrays equal in value, despite being in different order
 *
 * @param {Array<any>} arrayA the first array to test
 * @param {Array<any>} arrayB the second array to test
 * @param {function} isEqual the equality comparator
 * @param {any} meta the meta item to pass through
 * @returns {boolean} are the arrays equal absent order
 */

var hasItems = function hasItems(arrayA, arrayB, isEqual, meta) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (var index = 0; index < arrayA.length; index++) {
    if (!hasItem(arrayB, arrayA[index], isEqual, meta)) {
      return false;
    }
  }

  return true;
};
/**
 * @function sameValueZeroEqual
 *
 * @description
 * are the objects passed strictly equal or both NaN
 *
 * @param {any} objectA the object to compare against
 * @param {any} objectB the object to test
 * @returns {boolean} are the objects equal by the SameValueZero principle
 */

var sameValueZeroEqual = function sameValueZeroEqual(objectA, objectB) {
  return objectA === objectB || objectA !== objectA && objectB !== objectB;
};
/**
 * @function isPlainObject
 *
 * @description
 * is the object a plain object
 *
 * @param {any} object the object to test
 * @returns {boolean} is the object a plain object
 */

var isPlainObject = function isPlainObject(object) {
  return object.constructor === Object;
};
/**
 * @function isPromiseLike
 *
 * @description
 * is the object promise-like (thenable)
 *
 * @param {any} object the object to test
 * @returns {boolean} is the object promise-like
 */

var isPromiseLike = function isPromiseLike(object) {
  return typeof object.then === 'function';
};
/**
 * @function isReactElement
 *
 * @description
 * is the object passed a react element
 *
 * @param {any} object the object to test
 * @returns {boolean} is the object a react element
 */

var isReactElement = function isReactElement(object) {
  return !!(object.$$typeof && object._store);
};
/**
 * @function getNewCache
 *
 * @description
 * get a new cache object to prevent circular references
 *
 * @returns {Object|Weakset} the new cache object
 */

var getNewCache = function getNewCache() {
  return HAS_WEAKSET_SUPPORT ? new WeakSet() : Object.create({
    _values: [],
    add: function add(value) {
      this._values.push(value);
    },
    has: function has(value) {
      return !!~this._values.indexOf(value);
    }
  });
};
/**
 * @function createCircularEqual
 *
 * @description
 * create a custom isEqual handler specific to circular objects
 *
 * @param {funtion} [isEqual] the isEqual comparator to use instead of isDeepEqual
 * @returns {function(any, any): boolean}
 */

var createCircularEqual = function createCircularEqual(isEqual) {
  return function (isDeepEqual) {
    var comparator = isEqual || isDeepEqual;
    return function (objectA, objectB, cache) {
      if (cache === void 0) {
        cache = getNewCache();
      }

      var cacheHasA = cache.has(objectA);
      var cacheHasB = cache.has(objectB);

      if (cacheHasA || cacheHasB) {
        return cacheHasA && cacheHasB;
      }

      addObjectToCache(objectA, cache);
      addObjectToCache(objectB, cache);
      return comparator(objectA, objectB, cache);
    };
  };
};
/**
 * @function toPairs
 *
 * @param {Map|Set} iterable the iterable to convert to [key, value] pairs (entries)
 * @returns {{keys: Array<*>, values: Array<*>}} the [key, value] pairs
 */

var toPairs = function toPairs(iterable) {
  var pairs = {
    keys: [],
    values: []
  };
  iterable.forEach(function (value, key) {
    return pairs.keys.push(key) && pairs.values.push(value);
  });
  return pairs;
};
/**
 * @function areArraysEqual
 *
 * @description
 * are the arrays equal in value
 *
 * @param {Array<any>} arrayA the array to test
 * @param {Array<any>} arrayB the array to test against
 * @param {function} isEqual the comparator to determine equality
 * @param {any} meta the meta object to pass through
 * @returns {boolean} are the arrays equal
 */

var areArraysEqual = function areArraysEqual(arrayA, arrayB, isEqual, meta) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  for (var index = 0; index < arrayA.length; index++) {
    if (!isEqual(arrayA[index], arrayB[index], meta)) {
      return false;
    }
  }

  return true;
};
var createAreIterablesEqual = function createAreIterablesEqual(shouldCompareKeys) {
  /**
   * @function areIterablesEqual
   *
   * @description
   * determine if the iterables are equivalent in value
   *
   * @param {Array<Array<any>>} pairsA the pairs to test
   * @param {Array<Array<any>>} pairsB the pairs to test against
   * @param {function} isEqual the comparator to determine equality
   * @param {any} meta the cache possibly being used
   * @returns {boolean} are the objects equal in value
   */
  var areIterablesEqual = shouldCompareKeys ? function (pairsA, pairsB, isEqual, meta) {
    return hasItems(pairsA.keys, pairsB.keys, isEqual, meta) && hasItems(pairsA.values, pairsB.values, isEqual, meta);
  } : function (pairsA, pairsB, isEqual, meta) {
    return hasItems(pairsA.values, pairsB.values, isEqual, meta);
  };
  return function (iterableA, iterableB, isEqual, meta) {
    return areIterablesEqual(toPairs(iterableA), toPairs(iterableB), isEqual, meta);
  };
};
/**
 * @function areArraysEqual
 *
 * @description
 * are the objects equal in value
 *
 * @param {Array<any>} objectA the object to test
 * @param {Array<any>} objectB the object to test against
 * @param {function} isEqual the comparator to determine equality
 * @param {any} meta the meta object to pass through
 * @returns {boolean} are the objects equal
 */

var areObjectsEqual = function areObjectsEqual(objectA, objectB, isEqual, meta) {
  var keysA = keys(objectA);
  var keysB = keys(objectB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var key;

  for (var index = 0; index < keysA.length; index++) {
    key = keysA[index];

    if (!hasItem(keysB, key, sameValueZeroEqual)) {
      return false;
    } // if a react element, ignore the "_owner" key because its not necessary for equality comparisons


    if (key === '_owner' && isReactElement(objectA) && isReactElement(objectB)) {
      continue;
    }

    if (!isEqual(objectA[key], objectB[key], meta)) {
      return false;
    }
  }

  return true;
};
/**
 * @function areRegExpsEqual
 *
 * @description
 * are the regExps equal in value
 *
 * @param {RegExp} regExpA the regExp to test
 * @param {RegExp} regExpB the regExp to test agains
 * @returns {boolean} are the regExps equal
 */

var areRegExpsEqual = function areRegExpsEqual(regExpA, regExpB) {
  return regExpA.source === regExpB.source && regExpA.global === regExpB.global && regExpA.ignoreCase === regExpB.ignoreCase && regExpA.multiline === regExpB.multiline && regExpA.unicode === regExpB.unicode && regExpA.sticky === regExpB.sticky && regExpA.lastIndex === regExpB.lastIndex;
};

// constants
var isArray = Array.isArray;
var areMapsEqual = createAreIterablesEqual(true);
var areSetsEqual = createAreIterablesEqual(false);

var createComparator = function createComparator(createIsEqual) {
  // eslint-disable-next-line no-use-before-define
  var isEqual = typeof createIsEqual === 'function' ? createIsEqual(comparator) : comparator;
  /**
   * @function comparator
   *
   * @description
   * compare the value of the two objects and return true if they are equivalent in values
   *
   * @param {any} objectA the object to test against
   * @param {any} objectB the object to test
   * @param {any} [meta] an optional meta object that is passed through to all equality test calls
   * @returns {boolean} are objectA and objectB equivalent in value
   */

  function comparator(objectA, objectB, meta) {
    if (sameValueZeroEqual(objectA, objectB)) {
      return true;
    }

    var typeOfA = typeof objectA;

    if (typeOfA !== typeof objectB || typeOfA !== 'object' || !objectA || !objectB) {
      return false;
    }

    if (isPlainObject(objectA) && isPlainObject(objectB)) {
      return areObjectsEqual(objectA, objectB, isEqual, meta);
    }

    var arrayA = isArray(objectA);
    var arrayB = isArray(objectB);

    if (arrayA || arrayB) {
      return arrayA === arrayB && areArraysEqual(objectA, objectB, isEqual, meta);
    }

    var dateA = objectA instanceof Date;
    var dateB = objectB instanceof Date;

    if (dateA || dateB) {
      return dateA === dateB && sameValueZeroEqual(objectA.getTime(), objectB.getTime());
    }

    var regexpA = objectA instanceof RegExp;
    var regexpB = objectB instanceof RegExp;

    if (regexpA || regexpB) {
      return regexpA === regexpB && areRegExpsEqual(objectA, objectB);
    }

    if (isPromiseLike(objectA) || isPromiseLike(objectB)) {
      return objectA === objectB;
    }

    if (HAS_MAP_SUPPORT) {
      var mapA = objectA instanceof Map;
      var mapB = objectB instanceof Map;

      if (mapA || mapB) {
        return mapA === mapB && areMapsEqual(objectA, objectB, isEqual, meta);
      }
    }

    if (HAS_SET_SUPPORT) {
      var setA = objectA instanceof Set;
      var setB = objectB instanceof Set;

      if (setA || setB) {
        return setA === setB && areSetsEqual(objectA, objectB, isEqual, meta);
      }
    }

    return areObjectsEqual(objectA, objectB, isEqual, meta);
  }

  return comparator;
};

// comparator
var circularDeepEqual = createComparator(createCircularEqual());
var circularShallowEqual = createComparator(createCircularEqual(sameValueZeroEqual));
var deepEqual = createComparator();
var shallowEqual = createComparator(function () {
  return sameValueZeroEqual;
});


function withDedupe(superclass) {
    return class extends superclass {
        /**
         * Ensures that every emission is different than the previous one.
         */
        dedupe({ areEqual = deepEqual } = {}) {
            return this._nextOperator({
                operation({ emit }) {
                    let emitted = false;
                    let lastValue;
                    return ({ upstream }) => {
                        if (emitted && areEqual(upstream, lastValue)) {
                            return;
                        }
                        // To prevent a potential infinite loop, these flags must be set
                        // before emitting the result to the observer.
                        lastValue = upstream;
                        emitted = true;
                        emit(upstream);
                    };
                }
            });
        }
    };
}


function withDistanceFrom(superclass) {
    return class extends superclass {
        distanceFrom({ origin$ }) {
            if (!isDefined(origin$)) {
                origin$ = arguments[0];
            }
            return this._reactiveMap({
                transform({ upstream, origin }) {
                    if (isPoint2D(upstream)) {
                        return Math.sqrt(Math.pow((origin.x - upstream.x), 2) +
                            Math.pow((origin.y - upstream.y), 2));
                    }
                    else {
                        return Math.abs(origin - upstream);
                    }
                },
                inputs: {
                    origin: origin$,
                },
            });
        }
    };
}


function withDividedBy(superclass) {
    return class extends superclass {
        dividedBy(_a) {
            var { value$ } = _a, reactiveMapOptions = __rest(_a, ["value$"]);
            if (!isDefined(value$)) {
                value$ = arguments[0];
            }
            return this._mathOperator(Object.assign({ operation: (upstream, value) => upstream / value, value$ }, reactiveMapOptions));
        }
    };
}


/* tslint:disable */
var MemorylessMotionSubject;
var MotionObservable;
var MotionSubject;
/* tslint:enable */
function defineProxy(name, value) {
    switch (name) {
        case 'MemorylessMotionSubject':
            MemorylessMotionSubject = value;
            break;
        case 'MotionObservable':
            MotionObservable = value;
            break;
        case 'MotionProperty':
            break;
        case 'MotionSubject':
            MotionSubject = value;
            break;
        default:
            console.warn(name, 'not specified in defineProxy');
            break;
    }
}


/**
 * A stream backed by `requestAnimationFrame`, called once per frame with that
 * frame's timestamp.
 *
 * Useful as a pulse for `_debounce` to ensure that UI work only happens once
 * per frame.  Since no rendering will happen until `requestAnimationFrame` is
 * called, it should be safe to `_debounce({ pulse$: frame$ })` without missing
 * a frame.
 */
let frame$;
function getFrame$() {
    if (!frame$) {
        frame$ = new MotionObservable((observer) => {
            let queuedFrameID = 0;
            function queueFrame(frameTimestamp) {
                if (frameTimestamp) {
                    observer.next(frameTimestamp);
                }
                queuedFrameID = requestAnimationFrame(queueFrame);
            }
            queueFrame();
            return () => {
                cancelAnimationFrame(queuedFrameID);
            };
        })._multicast();
    }
    return frame$;
}


function withDebounce(superclass) {
    return class extends superclass {
        /**
         * Throttles the upstream subscription to emit its latest value whenever
         * `pulse$` emits.  If more than one value is received whilst awaiting
         * the pulse, the most recent value is emitted and the intermediaries are
         * forgotten.
         *
         * By default, it will throttle to the framerate using
         * `requestAnimationFrame`.
         */
        _debounce({ pulse$ = getFrame$() } = {}) {
            return new MotionObservable((observer) => {
                let awaitingEmit = false;
                let lastValue;
                const valueSubscription = this.subscribe((value) => {
                    lastValue = value;
                    awaitingEmit = true;
                });
                const pulseSubscription = pulse$.subscribe(() => {
                    if (awaitingEmit) {
                        awaitingEmit = false;
                        observer.next(lastValue);
                    }
                });
                return () => {
                    valueSubscription.unsubscribe();
                    pulseSubscription.unsubscribe();
                };
            });
        }
    };
}


function withFilter(superclass) {
    return class extends superclass {
        /**
         * Checks every incoming value with `predicate` and synchronously passes
         * values that return `true` to the observer.
         *
         * If `predicate` is not supplied, `_filter` will pass through any value
         * that is not `undefined`.
         */
        _filter({ predicate = isDefined } = {}) {
            return this._nextOperator({
                operation: ({ emit }) => ({ upstream }) => {
                    if (predicate(upstream)) {
                        emit(upstream);
                    }
                }
            });
        }
    };
}


function withFlattenIterables(superclass) {
    return class extends superclass {
        /**
         * Iterates over every value it receives from upstream and emits each
         * individually.
         */
        _flattenIterables() {
            return this._nextOperator({
                operation: ({ emit }) => ({ upstream: values }) => {
                    if (isIterable(values)) {
                        for (const value of values) {
                            emit(value);
                        }
                    }
                    else {
                        emit(values);
                    }
                }
            });
        }
    };
}


function withMap(superclass) {
    return class extends superclass {
        /**
         * Applies `transform` to every incoming value and synchronously passes the
         * result to the observer.
         */
        _map({ transform }) {
            return this._nextOperator({
                operation: ({ emit }) => ({ upstream }) => {
                    emit(transform(upstream));
                }
            });
        }
    };
}


function withMathOperator(superclass) {
    return class extends superclass {
        /**
         * Applies the operation to each dimension and emits the result.
         */
        _mathOperator(_a) {
            var { operation, value$ } = _a, reactiveMapOptions = __rest(_a, ["operation", "value$"]);
            return this._reactiveMap(Object.assign({ transform: ({ upstream, value }) => {
                    if (isPoint2D(upstream)) {
                        return {
                            x: operation(upstream.x, isDefined(value) ? value.x : undefined),
                            y: operation(upstream.y, isDefined(value) ? value.y : undefined),
                        };
                        // This block is just copy/pasted from the isPoint2D block.  It may
                        // eventually be worth making this smart enough to handle arbitrarily-
                        // shaped objects, but for now, we can cover most cases with just
                        // these two shapes.
                    }
                    else if (isDimensions(upstream)) {
                        return {
                            width: operation(upstream.width, isDefined(value) ? value.width : undefined),
                            height: operation(upstream.height, isDefined(value) ? value.height : undefined),
                        };
                    }
                    else {
                        return operation(upstream, value);
                    }
                }, inputs: {
                    value: value$,
                } }, reactiveMapOptions));
        }
    };
}


function withMulticast(superclass) {
    return class extends superclass {
        /**
         * Ensures that upstream operations are shared among all observers.  This is
         * useful to avoid repeating expensive operations and ensuring that any
         * side effects that may occur upstream only happen once.
         */
        _multicast() {
            const result = new MemorylessMotionSubject();
            this.subscribe(result);
            return result;
        }
    };
}


function withNextOperator(superclass) {
    return class extends superclass {
        /**
         * `_nextOperator` is sugar for creating an operator that reads and writes
         * from the `next` channel.  It encapsulates the stream creation and
         * subscription boilerplate required for most operators.
         *
         * Its argument `operation` should receive a value from the parent stream's
         * `next` channel, transform it, and use the supplied callback to emit the
         * result to the observer's `next` channel.
         */
        _nextOperator({ operation }) {
            return new MotionObservable((observer) => {
                const innerOperation = operation({
                    emit: observer.next.bind(observer),
                });
                const subscription = this.subscribe((value) => innerOperation({ upstream: value }));
                return subscription.unsubscribe;
            });
        }
    };
}


function withReactiveMap(superclass) {
    return class extends superclass {
        /**
         * Whenever the upstream value or an argument's value changes,
         * `_reactiveMap` calls `transform` and synchronously passes the result to
         * the observer.
         *
         * If the `onlyEmitWithUpstream` option is set, `transform` is only
         * called when the upstream value changes.
         */
        _reactiveMap({ transform, inputs, onlyEmitWithUpstream = false }) {
            let upstreamChanged = false;
            return this._tap({
                sideEffect() {
                    upstreamChanged = true;
                },
            })._reactiveNextOperator({
                operation: ({ emit }) => (values) => {
                    if (upstreamChanged || !onlyEmitWithUpstream) {
                        emit(transform(values));
                    }
                    upstreamChanged = false;
                },
                inputs
            });
        }
    };
}


function combineLatest(streams, { waitForAllValues = true } = {}) {
    return new MotionObservable((observer) => {
        const outstandingKeys = new Set(Object.keys(streams));
        let nextValue;
        if (isIterable(streams)) {
            nextValue = [];
        }
        else {
            nextValue = {};
        }
        const subscriptions = {};
        let initializing = true;
        outstandingKeys.forEach(checkKey);
        initializing = false;
        // TypeScript doesn't know whether the index signature for `streams` (and
        // hence, `nextValue` and `outstandingKeys`) is a string or a number.
        // Thus, it throws an error at a simple `streams[key]`.  Since we know
        // that whichever it is, `key` can index into all three collections, we
        // cast each to `Dict<V>` and `key` to `string`.  Then, TypeScript will
        // happily index into the collections using `key`.
        function checkKey(key) {
            const maybeStream = streams[key];
            if (isObservable(maybeStream)) {
                subscriptions[key] = maybeStream.subscribe((value) => {
                    outstandingKeys.delete(key);
                    nextValue[key] = value;
                    emitNextValue();
                });
            }
            else {
                outstandingKeys.delete(key);
                nextValue[key] = maybeStream;
                emitNextValue();
            }
        }
        function emitNextValue() {
            if (waitForAllValues ? outstandingKeys.size === 0 : !initializing) {
                observer.next((Array.isArray(nextValue)
                    ? [...nextValue]
                    : Object.assign({}, nextValue)));
            }
        }
        emitNextValue();
        return function disconnect() {
            Object.values(subscriptions).forEach(subscription => subscription.unsubscribe());
        };
    });
}


function withReactiveNextOperator(superclass) {
    return class extends superclass {
        /**
         * Similar to `_nextOperator`, but listens for values not just from
         * upstream, but also on any arguments it receives.
         *
         * It calls `operation` with the most recent values from upstream and from
         * the other arguments.  Arguments that aren't reactive will be passed
         * through as-they-are.  Arguments that are reactive will cause `operation`
         * to be called again for each value they emit.
         *
         * `_reactiveNextOperator` will not call `operation` until it has received
         * a value from every argument it is subscribed to.
         */
        _reactiveNextOperator(_a) {
            var { operation, inputs } = _a, combineLatestOptions = __rest(_a, ["operation", "inputs"]);
            return new MotionObservable((observer) => {
                const innerOperation = operation({
                    emit: observer.next.bind(observer),
                });
                // TODO: verify this is the correct type.
                //
                // I added `{upstream: Observable<T>}` because otherwise `inputs` was
                // getting inferred to require an `upstream` at a callsite.  This
                // appears to fix it, but I haven't taken the time to reason if it's
                // correct.
                return combineLatest(
                // TypeScript doesn't like ...inputs, so we use the longhand version
                Object.assign({ upstream: this }, inputs), combineLatestOptions).subscribe(innerOperation).unsubscribe;
            });
        }
    };
}


function withRemember(superclass) {
    return class extends superclass {
        /**
         * Remembers the most recent emission and synchronously emits it to all new
         * subscribers.
         *
         * `_remember()` is also useful for ensuring that expensive operations only
         * happen once per emission, sharing the resulting value with all observers.
         */
        _remember() {
            const result = new MotionSubject();
            this.subscribe(result);
            return result;
        }
    };
}


function withRead(superclass) {
    return class extends superclass {
        /**
         * Returns the current value of an observable property (e.g. a subject or
         * remembered stream).
         */
        _read() {
            let result;
            this.subscribe((value) => {
                result = value;
            }).unsubscribe();
            return result;
        }
    };
}


function withSlidingWindow(superclass) {
    return class extends superclass {
        /**
         * Emits the last values to be received in an array of the given `size`.
         *
         * Reuses the same array on each emit, so if you want to compare emissions,
         * make a copy of each as you receive it.
         */
        _slidingWindow({ size = 2 } = {}) {
            return this._nextOperator({
                operation({ emit }) {
                    const result = [];
                    return ({ upstream }) => {
                        result.push(upstream);
                        if (result.length > size) {
                            result.shift();
                        }
                        emit(result);
                    };
                }
            });
        }
    };
}


function withTap(superclass) {
    return class extends superclass {
        /**
         * Calls `sideEffect` for each value in the stream.  The result of
         * `sideEffect` is ignored - values received from upstream are passed-
         * through to the observer.
         */
        _tap({ sideEffect }) {
            return this._nextOperator({
                operation: ({ emit }) => ({ upstream }) => {
                    sideEffect({ upstream });
                    emit(upstream);
                }
            });
        }
    };
}


function withFoundationalMotionOperators(superclass) {
    // If we don't pass through an explicit value for `T`, it is inferred to be `{}`,
    // which is incorrect.  If we explicitly defined `T`, TypeScript won't infer
    // `S`.  Thus, we manually infer `S` with `typeof`.  Moreover, type inferrance
    // happens at definition time, so we need to define each step as a separate
    // constant.
    const result = withNextOperator(superclass);
    const result1 = withReactiveNextOperator(result);
    const result2 = withTap(result1);
    const result3 = withMap(result2);
    const result4 = withReactiveMap(result3);
    const result5 = withFilter(result4);
    const result6 = withMulticast(result5);
    const result7 = withRemember(result6);
    const result8 = withDebounce(result7);
    const result9 = withSlidingWindow(result8);
    const result10 = withRead(result9);
    const result11 = withMathOperator(result10);
    const result12 = withFlattenIterables(result11);
    return result12;
}


function withInverted(superclass) {
    return class extends superclass {
        /**
         * Emits the complementary percentage of a number between 0 and 1
         * (inclusive).
         *
         * For instance, if it receives `.33`, it will emit `.67`.
         */
        inverted() {
            return this._nextOperator({
                operation: ({ emit }) => ({ upstream }) => {
                    emit((1 - upstream));
                }
            });
        }
    };
}


function withIsAnyOf(superclass) {
    return class extends superclass {
        isAnyOf({ candidates }) {
            if (!isDefined(candidates)) {
                candidates = arguments[0];
            }
            return combineLatest([this, ...candidates])._map({
                transform: ([upstream, ...currentCandidates]) => currentCandidates.includes(upstream)
            });
        }
    };
}


function withPluck(superclass) {
    return class extends superclass {
        pluck({ path }) {
            if (!isDefined(path)) {
                path = arguments[0];
            }
            return this._map({
                transform: createPlucker(path)
            });
        }
    };
}
function createPlucker(path) {
    const pathSegments = path.split('.');
    return function plucker(value) {
        let result = value;
        for (const pathSegment of pathSegments) {
            result = result[pathSegment];
        }
        return result;
    };
}


function withLog(superclass) {
    return class extends superclass {
        log(kwargs = {}) {
            const { label = typeof kwargs === 'string'
                ? kwargs
                : '', pluckPath = '', } = kwargs;
            let plucker;
            if (pluckPath) {
                plucker = createPlucker(pluckPath);
            }
            return this._tap({
                sideEffect({ upstream: value }) {
                    if (plucker) {
                        value = plucker(value);
                    }
                    console.log(label, value);
                }
            });
        }
    };
}


function withMerge(superclass) {
    return class extends superclass {
        merge({ others }) {
            if (!isDefined(others)) {
                others = arguments[0];
            }
            return new MotionObservable((observer) => {
                const subscriptions = [this, ...others].map(stream => stream.subscribe(observer));
                return () => {
                    subscriptions.forEach(subscription => subscription.unsubscribe());
                };
            });
        }
    };
}


function withMultipliedBy(superclass) {
    return class extends superclass {
        multipliedBy(_a) {
            var { value$ } = _a, reactiveMapOptions = __rest(_a, ["value$"]);
            if (!isDefined(value$)) {
                value$ = arguments[0];
            }
            return this._mathOperator(Object.assign({ operation: (upstream, value) => upstream * value, value$ }, reactiveMapOptions));
        }
    };
}


function withRename(superclass) {
    return class extends superclass {
        rename(mapping) {
            if (mapping.mapping && Object.keys(mapping).length === 1) {
                mapping = mapping.mapping;
            }
            return this._map({
                transform(value) {
                    const result = {};
                    Object.entries(mapping).forEach(([oldKey, newKey]) => {
                        if (value.hasOwnProperty(oldKey)) {
                            result[newKey] = value[oldKey];
                        }
                    });
                    return result;
                }
            });
        }
    };
}


function withTimestamp(superclass) {
    return class extends superclass {
        timestamp() {
            return this._map({
                transform: timestamp,
            });
        }
    };
}
function timestamp(value) {
    return {
        value,
        timestamp: performance.now(),
    };
}


const SUPPRESS_FAILURES = Symbol();
function withRewrite(superclass) {
    return class extends superclass {
        rewrite({ mapping, defaultValue = SUPPRESS_FAILURES, emitOnKeyChange = true }) {
            let keys;
            let values;
            let castKeysToStrings = false;
            if (isMap(mapping)) {
                keys = Array.from(mapping.keys());
                values = Array.from(mapping.values());
            }
            else {
                keys = Object.keys(mapping);
                values = Object.values(mapping);
                castKeysToStrings = true;
            }
            let upstream = this;
            if (!emitOnKeyChange) {
                values = values.map(value => isObservable(value)
                    ? value.timestamp()
                    : timestamp(value));
                upstream = this.timestamp();
            }
            return upstream._reactiveNextOperator({
                operation: ({ emit }) => (_a) => {
                    var { upstream: currentKey } = _a, currentValues = __rest(_a, ["upstream"]);
                    if (currentKey !== undefined) {
                        let key = isTimestamped(currentKey)
                            ? currentKey.value
                            : currentKey;
                        if (castKeysToStrings) {
                            key = key.toString();
                        }
                        // TypeScript can't do Array<string | T>.indexOf(string | T), so we
                        // force it to pick one.  Doesn't matter, since the result is a
                        // number either way.
                        const index = keys.indexOf(key);
                        if (index === -1) {
                            if (defaultValue !== SUPPRESS_FAILURES) {
                                emit(defaultValue);
                            }
                        }
                        else {
                            const currentValue = currentValues[index];
                            // Wait until both the currentKey and currentValue have been
                            // defined before emitting.  This also presumes that the author
                            // is not intentionally rewriting to undefined.
                            if (currentValue !== undefined) {
                                const value = isTimestamped(currentValue)
                                    ? currentValue.value
                                    : currentValue;
                                // Prevent stale values from being emitted by only forwarding
                                // values that are newer than the key, unless
                                // emitOnKeyChange is set (which will omit the timestamps).
                                if (!isTimestamped(currentValue) || currentValue.timestamp > currentKey.timestamp) {
                                    emit(value);
                                }
                            }
                        }
                    }
                },
                inputs: values,
                waitForAllValues: false
            });
        }
    };
}


function withRewriteRange(superclass) {
    return class extends superclass {
        /**
         * Receives a value from upstream, linearly interpolates it between the given
         * ranges, and emits the result.
         */
        rewriteRange({ fromStart$ = 0, fromEnd$ = 1, toStart$ = 0, toEnd$ = 1, shouldClamp$ = false, }) {
            return this._reactiveNextOperator({
                operation: ({ emit }) => ({ upstream, fromStart, fromEnd, toStart, toEnd, shouldClamp, }) => {
                    const fromRange = fromStart - fromEnd;
                    const fromProgress = (upstream - fromEnd) / fromRange;
                    const toRange = toStart - toEnd;
                    const result = toEnd + fromProgress * toRange;
                    if (shouldClamp) {
                        const min = Math.min(toStart, toEnd);
                        const max = Math.max(toStart, toEnd);
                        emit(Math.max(min, Math.min(result, max)));
                    }
                    else {
                        emit(result);
                    }
                },
                inputs: {
                    fromStart: fromStart$,
                    fromEnd: fromEnd$,
                    toStart: toStart$,
                    toEnd: toEnd$,
                    shouldClamp: shouldClamp$,
                },
            });
        }
    };
}


function withRewriteTo(superclass) {
    return class extends superclass {
        rewriteTo(_a) {
            var { value$, onlyEmitWithUpstream = true } = _a, reactiveMapOptions = __rest(_a, ["value$", "onlyEmitWithUpstream"]);
            if (!isDefined(value$)) {
                value$ = arguments[0];
            }
            return this._reactiveMap(Object.assign({ transform: ({ value }) => value, inputs: {
                    value: value$
                }, onlyEmitWithUpstream }, reactiveMapOptions));
        }
    };
}


function withStartWith(superclass) {
    return class extends superclass {
        startWith({ value }) {
            const hasValue = isDefined(value);
            // Only destructure if the supplied argument has the correct number of
            // members.
            if (!hasValue || (hasValue && Object.keys(arguments[0]).length > 1)) {
                value = arguments[0];
            }
            return new MotionObservable((observer) => {
                observer.next(value);
                const subscription = this.subscribe(observer);
                return subscription.unsubscribe;
            })._remember();
        }
    };
}


function withSubtractedBy(superclass) {
    return class extends superclass {
        subtractedBy(_a) {
            var { value$ } = _a, reactiveMapOptions = __rest(_a, ["value$"]);
            if (!isDefined(value$)) {
                value$ = arguments[0];
            }
            return this._mathOperator(Object.assign({ operation: (upstream, value) => upstream - value, value$ }, reactiveMapOptions));
        }
    };
}


function withThreshold(superclass) {
    return class extends superclass {
        threshold(_a) {
            var { limit$ } = _a, reactiveMapOptions = __rest(_a, ["limit$"]);
            if (!isDefined(limit$)) {
                limit$ = arguments[0];
            }
            return this._reactiveMap(Object.assign({ transform: ({ upstream, limit }) => {
                    if (upstream < limit) {
                        return ThresholdRegion$1.BELOW;
                    }
                    else if (upstream > limit) {
                        return ThresholdRegion$1.ABOVE;
                    }
                    else {
                        return ThresholdRegion$1.WITHIN;
                    }
                }, inputs: {
                    limit: limit$,
                } }, reactiveMapOptions));
        }
    };
}


function withThresholdRange(superclass) {
    return class extends superclass {
        thresholdRange(_a) {
            var { start$, end$ } = _a, _reactiveMapOptions = __rest(_a, ["start$", "end$"]);
            return this._reactiveMap(Object.assign({ transform: ({ upstream, start, end }) => {
                    const lowerLimit = Math.min(start, end);
                    const upperLimit = Math.max(start, end);
                    if (upstream < lowerLimit) {
                        return ThresholdRegion$1.BELOW;
                    }
                    else if (upstream > upperLimit) {
                        return ThresholdRegion$1.ABOVE;
                    }
                    else {
                        return ThresholdRegion$1.WITHIN;
                    }
                }, inputs: {
                    start: start$,
                    end: end$
                } }, _reactiveMapOptions));
        }
    };
}


function withToPolar(superclass) {
    return class extends superclass {
        toPolar({ origin$ }) {
            if (!isDefined(origin$)) {
                origin$ = arguments[0];
            }
            return this._reactiveMap({
                transform({ upstream, origin }) {
                    const deltaX = upstream.x - origin.x;
                    const deltaY = upstream.y - origin.y;
                    return {
                        // Inlining Pythagorean theorem instead of using `combineLatest` +
                        // `distanceFrom`, both for simplicity and to avoid emitting twice
                        // for each upstream emission.
                        distance: Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
                        angle: Math.atan2(deltaY, deltaX),
                    };
                },
                inputs: {
                    origin: origin$,
                },
            });
        }
    };
}


function withMotionOperators(superclass) {
    const result = withFoundationalMotionOperators(superclass);
    const result1 = withDedupe(result);
    const result2 = withLog(result1);
    const result3 = withMerge(result2);
    const result4 = withTimestamp(result3);
    const result5 = withStartWith(result4);
    const result6 = withRewrite(result5);
    const result7 = withRewriteTo(result6);
    const result8 = withRewriteRange(result7);
    const result9 = withPluck(result8);
    const result10 = withAddedBy(result9);
    const result11 = withSubtractedBy(result10);
    const result12 = withMultipliedBy(result11);
    const result13 = withDividedBy(result12);
    const result14 = withDistanceFrom(result13);
    const result15 = withClampTo(result14);
    const result16 = withThresholdRange(result15);
    const result17 = withThreshold(result16);
    const result18 = withIsAnyOf(result17);
    const result19 = withAppendUnit(result18);
    const result20 = withInverted(result19);
    const result21 = withToPolar(result20);
    const result22 = withRename(result21);
    return result22;
}

function symbolObservablePonyfill$1(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root$1;

if (typeof self !== 'undefined') {
  root$1 = self;
} else if (typeof window !== 'undefined') {
  root$1 = window;
} else if (typeof global !== 'undefined') {
  root$1 = global;
} else if (typeof module !== 'undefined') {
  root$1 = module;
} else {
  root$1 = Function('return this')();
}

var $observable$1 = symbolObservablePonyfill$1(root$1);


/**
 * `Observable` is a standard interface that's useful for modeling multiple,
 * asynchronous events.
 *
 * `IndefiniteObservable` is a minimalist implementation of a subset of the TC39
 * Observable proposal.  It is indefinite because it will never call `complete`
 * or `error` on the provided observer.
 */
class IndefiniteObservable {
    /**
     * The provided function should receive an observer and connect that
     * observer's `next` method to an event source (for instance,
     * `element.addEventListener('click', observer.next)`).
     *
     * It must return a function that will disconnect the observer from the event
     * source.
     */
    constructor(connect) {
        this._connect = connect;
    }
    /**
     * `subscribe` uses the function supplied to the constructor to connect an
     * observer to an event source.  Each observer is connected independently:
     * each call to `subscribe` calls `connect` with the new observer.
     *
     * To disconnect the observer from the event source, call `unsubscribe` on the
     * returned subscription.
     *
     * Note: `subscribe` accepts either a function or an object with a
     * next method.
     */
    subscribe(observerOrNext) {
        // For simplicity's sake, `subscribe` accepts `next` either as either an
        // anonymous function or wrapped in an object (the observer).  Since
        // `connect` always expects to receive an observer, wrap any loose
        // functions in an object.
        const observer = wrapWithObserver(observerOrNext);
        let disconnect = this._connect(observer);
        return {
            unsubscribe() {
                if (disconnect) {
                    disconnect();
                    disconnect = undefined;
                }
            }
        };
    }
    /**
     * Tells other libraries that know about observables that we are one.
     *
     * https://github.com/tc39/proposal-observable#observable
     */
    [$observable$1]() {
        return this;
    }
}




class BaseMotionObservable extends IndefiniteObservable {
    /**
     * Creates a new `MotionObservable` that emits whatever values it receives
     * from the provided stream.
     *
     * This is useful for imbuing another type of `Observable`, like an
     * `IndefiniteSubject`, with the operators present on `MotionObservable`.
     */
    static from(stream) {
        return new MotionObservable$1((observer) => {
            const subscription = stream.subscribe(observer);
            return subscription.unsubscribe;
        });
    }
}
/**
 * `MotionObservable` is an extension of `IndefiniteObservable` that includes a
 * series of purely-declarative operators that are useful for building animated
 * interactions.  Those operators are specified in the
 * [Starmap](https://material-motion.github.io/material-motion/starmap/specifications/operators/)
 */
class MotionObservable$1 extends withMotionOperators(BaseMotionObservable) {
}
// See explanation in `./proxies`
try {
    fulfillProxies();
}
catch (error) { }


/**
 * A Subject that exposes its last value via `read()` and `write(nextValue)`.
 *
 * Writes will be broadcast to all observers.
 */
class ReactiveProperty extends IndefiniteSubject {
    constructor(readableWritable) {
        super();
        // IndefiniteSubject caches the last emission as `_lastEmission`.
        //
        // If the user supplies `read` and `write` functions, we replace
        // `_subject._lastEmission` with them, so all reads and writes go through
        // the user-supplied getter/setter.
        if (readableWritable) {
            Object.defineProperty(this, '_lastEmission', {
                get: readableWritable.read,
                set: readableWritable.write,
            });
        }
    }
    read() {
        return this._lastEmission;
    }
    write(value) {
        this.next(value);
    }
}


class MotionProperty$1 extends withMotionOperators(ReactiveProperty) {
}
// See explanation in `./proxies`
try {
    fulfillProxies();
}
catch (error) { }


class MotionSubject$1 extends withMotionOperators(IndefiniteSubject) {
}
// See explanation in `./proxies`
try {
    fulfillProxies();
}
catch (error) { }


// See explanation in `./proxies`
function fulfillProxies() {
    if (MemorylessMotionSubject$1 && MotionObservable$1 && MotionProperty$1 && MotionSubject$1) {
        defineProxy('MemorylessMotionSubject', MemorylessMotionSubject$1);
        defineProxy('MotionObservable', MotionObservable$1);
        defineProxy('MotionProperty', MotionProperty$1);
        defineProxy('MotionSubject', MotionSubject$1);
    }
}


class MemorylessMotionSubject$1 extends withMotionOperators(MemorylessIndefiniteSubject) {
}
// See explanation in `./proxies`
try {
    fulfillProxies();
}
catch (error) { }


function createProperty({ initialValue } = {}) {
    const result = new MotionProperty$1();
    if (initialValue !== undefined) {
        result.write(initialValue);
    }
    return result;
}




function isTrue(value) {
    return value === true;
}
/**
 * Accepts an array of streams and returns a stream that emits true when the
 * most recent emission from at least one of them is true.  Inert until it has
 * received a value from each stream in the array.
 */
function anyOf(streams) {
    return combineLatest(streams)._map({
        transform: (values) => values.some(isTrue)
    });
}
/**
 * Accepts an array of streams and returns a stream that emits true when the
 * most recent emission from each of them is true.  Inert until it has received
 * a value from each stream in the array.
 */
function allOf(streams) {
    return combineLatest(streams)._map({
        transform: (values) => values.every(isTrue)
    });
}
/**
 * Accepts an array of streams and returns a stream that emits true when
 * the most recent emission from each of them is false.  Inert until it has
 * received a value from each stream in the array.
 */
function noneOf(streams) {
    return not(anyOf(streams));
}
/**
 * Accepts an stream of booleans and returns a stream of where each emission is
 * the opposite of what was emitted upstream.
 */
function not(stream) {
    return stream._map({
        transform: (value) => !value
    });
}
/**
 * Accepts a single stream of booleans and emits whenever that stream
 * emits `true`.  Useful in combination with the other aggregators, e.g.:
 *
 * when(
 *   a.recognitionState$.isAnyOf([GestureRecognitionState.BEGAN])
 * ).subscribe(b.cancellation$)
 */
function when(stream) {
    return stream._filter({ predicate: isTrue });
}


function subscribe({ sink, sinks, source }) {
    if (sink) {
        return source.subscribe(sink);
    }
    else {
        return sinks.map((sink) => source.subscribe(sink));
    }
}


// These constants are exported for testing.
const MAXIMUM_AGE = 250;
const MAXIMUM_INCOMING_DISPATCHES = 5;
const pluckTimestamp = createPlucker('timestamp');
const pluckValue = createPlucker('value');
const pluckX = createPlucker('value.x');
const pluckY = createPlucker('value.y');
/**
 * Computes the velocity of an incoming stream and emits the result. Velocity's
 * denominator is in milliseconds; if the incoming stream is measured in pixels,
 * the resulting stream will be in pixels / millisecond.
 *
 * Velocity is computed by watching the trailing 250ms of up to 5 emissions and
 * measuring the distance between the longest pair of events moving in the
 * current direction.  This approach is more resiliant to anomolous data than a
 * simple (nextPosition - prevPosition) / (nextTime - prevTime).
 *
 * If `pulse$` is supplied, `velocity(pulse$)` will only emit values when
 * `pulse$` emits a value.  This is useful for ensuring that velocity is only
 * calculated when it will be used.
 */
function getVelocity$({ value$, pulse$, 
    // These values are borrowed from Matthew Bolohan's drag implementation (which
    // presumes the units are "px / ms").
    maximumVelocity = 5, defaultVelocity = 1, }) {
    return new MotionObservable((observer) => {
        let records = [];
        const trailingSubscription = value$.timestamp()._slidingWindow({ size: MAXIMUM_INCOMING_DISPATCHES }).subscribe(nextRecords => records = nextRecords);
        const pulseSubscription = pulse$.timestamp().subscribe(({ timestamp: now }) => {
            const recentRecords = records.filter(({ timestamp }) => now - timestamp < MAXIMUM_AGE);
            if (records.length && isPoint2D(records[0].value)) {
                observer.next({
                    x: calculateVelocity({ records: recentRecords, pluckValue: pluckX, pluckTimestamp, maximumVelocity, defaultVelocity }),
                    y: calculateVelocity({ records: recentRecords, pluckValue: pluckY, pluckTimestamp, maximumVelocity, defaultVelocity }),
                });
            }
            else {
                observer.next(calculateVelocity({ records: recentRecords, pluckValue, pluckTimestamp, maximumVelocity, defaultVelocity }));
            }
        });
        return () => {
            trailingSubscription.unsubscribe();
            pulseSubscription.unsubscribe();
        };
    });
}
/**
 * Computes velocity using the oldest value that's moving in the current
 * direction.
 *
 * It walks backwards over an array of records and makes sure that each segment
 * is going in the same direction (incrementing or decrementing) as the last
 * segment.  When it detects a change in direction (or has checked the whole
 * array), it returns the velocity between the newest value and the oldest
 * moving in the same direction.
 */
function calculateVelocity({ records, pluckValue, pluckTimestamp, maximumVelocity, defaultVelocity }) {
    if (records.length < 2) {
        return 0;
    }
    let velocity = 0;
    // Backing over the array pairwise, `next` is the newer value and `prev` is
    // the older value.  `last` is always the final value.
    const lastIndex = records.length - 1;
    const lastValue = pluckValue(records[lastIndex]);
    const lastTimestamp = pluckTimestamp(records[lastIndex]);
    let prevValue;
    let prevTimestamp;
    let nextValue = lastValue;
    let nextTimestamp = lastTimestamp;
    for (let i = lastIndex - 1; i >= 0; i--) {
        prevValue = pluckValue(records[i]);
        prevTimestamp = pluckTimestamp(records[i]);
        const averageVelocity = (lastValue - prevValue) / (lastTimestamp - prevTimestamp);
        const pairwiseVelocity = (nextValue - prevValue) / (nextTimestamp - prevTimestamp);
        if (velocity !== 0 && pairwiseVelocity > 0 !== velocity > 0) {
            break;
        }
        else {
            velocity = averageVelocity;
        }
        nextValue = prevValue;
        nextTimestamp = prevTimestamp;
    }
    if (Math.abs(velocity) > maximumVelocity) {
        // If there isn't enough data to trust our accuracy (perhaps the main thread
        // was blocked), use the default velocity.
        const direction = velocity / Math.abs(velocity);
        if (records.length < 3) {
            velocity = direction * defaultVelocity;
        }
        else {
            velocity = direction * maximumVelocity;
        }
    }
    return velocity;
}


class Draggable {
    constructor({ down$, move$, up$, cancel$, contextMenu$, capturedClick$, capturedDragStart$ }) {
        this.state$ = createProperty({
            initialValue: State$1.AT_REST,
        });
        this.recognitionState$ = createProperty({
            initialValue: GestureRecognitionState$1.POSSIBLE,
        });
        this.recognitionThreshold$ = createProperty({
            initialValue: 16,
        });
        this.axis$ = createProperty({
            initialValue: Axis$1.ALL,
        });
        this.cancellation$ = new MemorylessMotionSubject$1();
        this.enabled$ = new MemorylessMotionSubject$1();
        this.down$ = down$;
        this.move$ = move$;
        this.up$ = up$;
        this.cancel$ = cancel$;
        this.contextMenu$ = contextMenu$;
        this.capturedClick$ = capturedClick$;
        this.capturedDragStart$ = capturedDragStart$;
        this.value$ = new MotionObservable$1((observer) => {
            let downSubscription;
            let moveSubscription;
            let cancellationSubscription;
            let enabledSubscription;
            // If we've recognized a drag, we'll prevent any children from receiving
            // clicks.
            let preventClicks = false;
            // HTML's OS-integrated drag-and-drop will interrupt a PointerEvent stream
            // without emitting pointercancel; this is the best way I've found to
            // prevent that.
            //
            // See also https://github.com/w3c/pointerevents/issues/205
            const capturedDragStartSubscription = capturedDragStart$.subscribe((dragStartEvent) => {
                dragStartEvent.preventDefault();
            });
            const capturedClickSubscription = capturedClick$.subscribe((clickEvent) => {
                if (preventClicks) {
                    clickEvent.preventDefault();
                    clickEvent.stopImmediatePropagation();
                }
            });
            const subscribeToDown = () => {
                return down$.subscribe((downEvent) => {
                    this.state$.write(State$1.ACTIVE);
                    const currentAxis = this.axis$.read();
                    // If we get a new down event while we're already listening for
                    // moves, ignore it.
                    if (!moveSubscription) {
                        preventClicks = false;
                        if (isPointerEvent(downEvent)) {
                            // The `as Element` is a workaround for
                            // https://github.com/Microsoft/TypeScript/issues/299
                            downEvent.target.setPointerCapture(downEvent.pointerId);
                        }
                        moveSubscription = move$.merge([up$])._filter({
                            predicate: (nextEvent) => nextEvent.pointerId === downEvent.pointerId
                        }).subscribe((nextEvent) => {
                            const atRest = nextEvent.type.includes('up');
                            const translation = {
                                x: currentAxis !== Axis$1.Y
                                    ? nextEvent.x - downEvent.x
                                    : 0,
                                y: currentAxis !== Axis$1.X
                                    ? nextEvent.y - downEvent.y
                                    : 0,
                            };
                            switch (this.recognitionState$.read()) {
                                case GestureRecognitionState$1.POSSIBLE:
                                    if (Math.sqrt(Math.pow(translation.x, 2) + Math.pow(translation.y, 2)) > this.recognitionThreshold$.read()) {
                                        this.recognitionState$.write(GestureRecognitionState$1.BEGAN);
                                        preventClicks = true;
                                    }
                                    break;
                                case GestureRecognitionState$1.BEGAN:
                                    this.recognitionState$.write(GestureRecognitionState$1.CHANGED);
                                    break;
                                default: break;
                            }
                            if (atRest) {
                                // This would be a takeWhile if we were using an Observable
                                // implementation that supported completion.
                                moveSubscription.unsubscribe();
                                moveSubscription = undefined;
                                if (this.recognitionState$.read() === GestureRecognitionState$1.POSSIBLE) {
                                    this.recognitionState$.write(GestureRecognitionState$1.FAILED);
                                }
                                else {
                                    this.recognitionState$.write(GestureRecognitionState$1.ENDED);
                                }
                                // Doing the simple thing for now and setting AT_REST in up,
                                // but it might be better on a delay to give time for clicks
                                // to happen first.
                                this.state$.write(State$1.AT_REST);
                                this.recognitionState$.write(GestureRecognitionState$1.POSSIBLE);
                            }
                            else {
                                observer.next(translation);
                            }
                        });
                    }
                });
            };
            downSubscription = subscribeToDown();
            enabledSubscription = this.enabled$.subscribe((enabled) => {
                if (enabled && !downSubscription) {
                    downSubscription = subscribeToDown();
                }
                else if (!enabled && downSubscription) {
                    downSubscription.unsubscribe();
                    downSubscription = undefined;
                    preventClicks = false;
                    // moveSubscription handled by cancellation flow
                }
            });
            cancellationSubscription = this.cancellation$.merge([
                when(not(this.enabled$)),
                cancel$,
                contextMenu$,
            ]).subscribe(() => {
                if (moveSubscription) {
                    moveSubscription.unsubscribe();
                    moveSubscription = undefined;
                    this.recognitionState$.write(GestureRecognitionState$1.CANCELLED);
                    this.state$.write(State$1.AT_REST);
                    this.recognitionState$.write(GestureRecognitionState$1.POSSIBLE);
                }
            });
            return () => {
                capturedClickSubscription.unsubscribe();
                capturedDragStartSubscription.unsubscribe();
                if (downSubscription) {
                    downSubscription.unsubscribe();
                }
                if (moveSubscription) {
                    moveSubscription.unsubscribe();
                }
                if (cancellationSubscription) {
                    cancellationSubscription.unsubscribe();
                }
                if (enabledSubscription) {
                    enabledSubscription.unsubscribe();
                }
            };
        })._multicast();
    }
    get state() {
        return this.state$.read();
    }
    get recognitionState() {
        return this.recognitionState$.read();
    }
    get recognitionThreshold() {
        return this.recognitionThreshold$.read();
    }
    set recognitionThreshold(value) {
        this.recognitionThreshold$.write(value);
    }
    get axis() {
        return this.axis$.read();
    }
    set axis(value) {
        this.axis$.write(value);
    }
    cancel() {
        this.cancellation$.next(undefined);
    }
    enable() {
        this.enabled$.next(true);
    }
    disable() {
        this.enabled$.next(false);
    }
}

/** @license for wobble
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2017 Adam Miskiewicz
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
function invariant(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
function withDefault(maybeValue, defaultValue) {
    return typeof maybeValue !== "undefined" && maybeValue !== null
        ? maybeValue
        : defaultValue;
}

/**
 * Implements a spring physics simulation based on the equations behind
 * damped harmonic oscillators (https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator).
 */
class Spring {
    constructor(config = {}) {
        this._listeners = [];
        this._currentAnimationStep = 0; // current requestAnimationFrame
        this._currentTime = 0; // Current timestamp of animation in ms (real time)
        this._springTime = 0; // Current time along the spring curve in ms (zero-based)
        this._currentValue = 0; // the current value of the spring
        this._currentVelocity = 0; // the current velocity of the spring
        this._isAnimating = false;
        this._oscillationVelocityPairs = [];
        this._config = {
            fromValue: withDefault(config.fromValue, 0),
            toValue: withDefault(config.toValue, 1),
            stiffness: withDefault(config.stiffness, 100),
            damping: withDefault(config.damping, 10),
            mass: withDefault(config.mass, 1),
            initialVelocity: withDefault(config.initialVelocity, 0),
            overshootClamping: withDefault(config.overshootClamping, false),
            allowsOverdamping: withDefault(config.allowsOverdamping, false),
            restVelocityThreshold: withDefault(config.restVelocityThreshold, 0.001),
            restDisplacementThreshold: withDefault(config.restDisplacementThreshold, 0.001)
        };
        this._currentValue = this._config.fromValue;
        this._currentVelocity = this._config.initialVelocity;
    }
    /**
     * If `fromValue` differs from `toValue`, or `initialVelocity` is non-zero,
     * start the simulation and call the `onStart` listeners.
     */
    start() {
        const { fromValue, toValue, initialVelocity } = this._config;
        if (fromValue !== toValue || initialVelocity !== 0) {
            this._reset();
            this._isAnimating = true;
            if (!this._currentAnimationStep) {
                this._notifyListeners("onStart");
                this._currentAnimationStep = requestAnimationFrame((t) => {
                    this._step(Date.now());
                });
            }
        }
        return this;
    }
    /**
     * If a simulation is in progress, stop it and call the `onStop` listeners.
     */
    stop() {
        if (!this._isAnimating) {
            return this;
        }
        this._isAnimating = false;
        this._notifyListeners("onStop");
        if (this._currentAnimationStep) {
            cancelAnimationFrame(this._currentAnimationStep);
            this._currentAnimationStep = 0;
        }
        return this;
    }
    /**
     * The spring's current position.
     */
    get currentValue() {
        return this._currentValue;
    }
    /**
     * The spring's current velocity in units / ms.
     */
    get currentVelocity() {
        return this._currentVelocity; // give velocity in units/ms;
    }
    /**
     * If the spring has reached its `toValue`, or if its velocity is below the
     * `restVelocityThreshold`, it is considered at rest. If `stop()` is called
     * during a simulation, both `isAnimating` and `isAtRest` will be false.
     */
    get isAtRest() {
        return this._isSpringAtRest();
    }
    /**
     * Whether or not the spring is currently emitting values.
     *
     * Note: this is distinct from whether or not it is at rest.
     * See also `isAtRest`.
     */
    get isAnimating() {
        return this._isAnimating;
    }
    /**
     * Updates the spring config with the given values.  Values not explicitly
     * supplied will be reused from the existing config.
     */
    updateConfig(updatedConfig) {
        // When we update the spring config, we reset the simulation to ensure the
        // spring always moves the full distance between `fromValue` and `toValue`.
        // To ensure that the simulation behaves correctly if those values aren't
        // being changed in `updatedConfig`, we run the simulation with `_step()`
        // and default `fromValue` and `initialVelocity` to their current values.
        this._advanceSpringToTime(Date.now());
        const baseConfig = {
            fromValue: this._currentValue,
            initialVelocity: this._currentVelocity
        };
        this._config = Object.assign({}, this._config, baseConfig, updatedConfig);
        this._reset();
        return this;
    }
    /**
     * The provided callback will be invoked when the simulation begins.
     */
    onStart(listener) {
        this._listeners.push({ onStart: listener });
        return this;
    }
    /**
     * The provided callback will be invoked on each frame while the simulation is
     * running.
     */
    onUpdate(listener) {
        this._listeners.push({ onUpdate: listener });
        return this;
    }
    /**
     * The provided callback will be invoked when the simulation ends.
     */
    onStop(listener) {
        this._listeners.push({ onStop: listener });
        return this;
    }
    /**
     * Remove a single listener from this spring.
     */
    removeListener(listenerFn) {
        this._listeners = this._listeners.reduce((result, listener) => {
            const foundListenerFn = Object.values(listener).indexOf(listenerFn) !== -1;
            if (!foundListenerFn) {
                result.push(listener);
            }
            return result;
        }, []);
        return this;
    }
    /**
     * Removes all listeners from this spring.
     */
    removeAllListeners() {
        this._listeners = [];
        return this;
    }
    _reset() {
        this._currentTime = Date.now();
        this._springTime = 0.0;
        this._currentValue = this._config.fromValue;
        this._currentVelocity = this._config.initialVelocity;
    }
    _notifyListeners(eventName) {
        this._listeners.forEach((listener) => {
            const maybeListenerFn = listener[eventName];
            if (typeof maybeListenerFn === "function") {
                maybeListenerFn(this);
            }
        });
    }
    /**
     * `_step` is the main loop.  While the animation is running, it updates the
     * current state once per frame, and schedules the next frame if the spring is
     * not yet at rest.
     */
    _step(timestamp) {
        this._advanceSpringToTime(timestamp, true);
        // check `_isAnimating`, in case `stop()` got called during
        // `_advanceSpringToTime()`
        if (this._isAnimating) {
            this._currentAnimationStep = requestAnimationFrame((t) => this._step(Date.now()));
        }
    }
    _advanceSpringToTime(timestamp, shouldNotifyListeners = false) {
        // `_advanceSpringToTime` updates `_currentTime` and triggers the listeners.
        // Because of these side effects, it's only safe to call when an animation
        // is already in-progress.
        if (!this._isAnimating) {
            return;
        }
        let deltaTime = timestamp - this._currentTime;
        // If for some reason we lost a lot of frames (e.g. process large payload or
        // stopped in the debugger), we only advance by 4 frames worth of
        // computation and will continue on the next frame. It's better to have it
        // running at slower speed than jumping to the end.
        if (deltaTime > Spring.MAX_DELTA_TIME_MS) {
            deltaTime = Spring.MAX_DELTA_TIME_MS;
        }
        this._springTime += deltaTime;
        const c = this._config.damping;
        const m = this._config.mass;
        const k = this._config.stiffness;
        const fromValue = this._config.fromValue;
        const toValue = this._config.toValue;
        const v0 = -this._config.initialVelocity;
        invariant(m > 0, "Mass value must be greater than 0");
        invariant(k > 0, "Stiffness value must be greater than 0");
        invariant(c > 0, "Damping value must be greater than 0");
        let zeta = c / (2 * Math.sqrt(k * m)); // damping ratio (dimensionless)
        const omega0 = Math.sqrt(k / m) / 1000; // undamped angular frequency of the oscillator (rad/ms)
        const omega1 = omega0 * Math.sqrt(1.0 - zeta * zeta); // exponential decay
        const omega2 = omega0 * Math.sqrt(zeta * zeta - 1.0); // frequency of damped oscillation
        const x0 = toValue - fromValue; // initial displacement of the spring at t = 0
        if (zeta > 1 && !this._config.allowsOverdamping) {
            zeta = 1;
        }
        let oscillation = 0.0;
        let velocity = 0.0;
        const t = this._springTime;
        if (zeta < 1) {
            // Under damped
            const envelope = Math.exp(-zeta * omega0 * t);
            oscillation =
                toValue -
                    envelope *
                        ((v0 + zeta * omega0 * x0) / omega1 * Math.sin(omega1 * t) +
                            x0 * Math.cos(omega1 * t));
            // This looks crazy -- it's actually just the derivative of the
            // oscillation function
            velocity =
                zeta *
                    omega0 *
                    envelope *
                    (Math.sin(omega1 * t) * (v0 + zeta * omega0 * x0) / omega1 +
                        x0 * Math.cos(omega1 * t)) -
                    envelope *
                        (Math.cos(omega1 * t) * (v0 + zeta * omega0 * x0) -
                            omega1 * x0 * Math.sin(omega1 * t));
        }
        else if (zeta === 1) {
            // Critically damped
            const envelope = Math.exp(-omega0 * t);
            oscillation = toValue - envelope * (x0 + (v0 + omega0 * x0) * t);
            velocity =
                envelope * (v0 * (t * omega0 - 1) + t * x0 * (omega0 * omega0));
        }
        else {
            // Overdamped
            const envelope = Math.exp(-zeta * omega0 * t);
            oscillation =
                toValue -
                    envelope *
                        ((v0 + zeta * omega0 * x0) * Math.sinh(omega2 * t) +
                            omega2 * x0 * Math.cosh(omega2 * t)) /
                        omega2;
            velocity =
                envelope *
                    zeta *
                    omega0 *
                    (Math.sinh(omega2 * t) * (v0 + zeta * omega0 * x0) +
                        x0 * omega2 * Math.cosh(omega2 * t)) /
                    omega2 -
                    envelope *
                        (omega2 * Math.cosh(omega2 * t) * (v0 + zeta * omega0 * x0) +
                            omega2 * omega2 * x0 * Math.sinh(omega2 * t)) /
                        omega2;
        }
        this._currentTime = timestamp;
        this._currentValue = oscillation;
        this._currentVelocity = velocity;
        if (!shouldNotifyListeners) {
            return;
        }
        this._notifyListeners("onUpdate");
        if (!this._isAnimating) {
            // a listener might have stopped us in _onUpdate
            return;
        }
        // If the Spring is overshooting (when overshoot clamping is on), or if the
        // spring is at rest (based on the thresholds set in the config), stop the
        // animation.
        if (this._isSpringOvershooting() || this._isSpringAtRest()) {
            if (k !== 0) {
                // Ensure that we end up with a round value
                this._currentValue = toValue;
                this._currentVelocity = 0;
                this._notifyListeners("onUpdate");
            }
            this.stop();
            return;
        }
    }
    _isSpringOvershooting() {
        const { stiffness, fromValue, toValue, overshootClamping } = this._config;
        let isOvershooting = false;
        if (overshootClamping && stiffness !== 0) {
            if (fromValue < toValue) {
                isOvershooting = this._currentValue > toValue;
            }
            else {
                isOvershooting = this._currentValue < toValue;
            }
        }
        return isOvershooting;
    }
    _isSpringAtRest() {
        const { stiffness, toValue, restDisplacementThreshold, restVelocityThreshold } = this._config;
        const isNoVelocity = Math.abs(this._currentVelocity) <= restVelocityThreshold;
        const isNoDisplacement = stiffness !== 0 &&
            Math.abs(toValue - this._currentValue) <= restDisplacementThreshold;
        return isNoDisplacement && isNoVelocity;
    }
}
Spring.MAX_DELTA_TIME_MS = 1 / 60 * 1000 * 4; // advance 4 frames at max


const DEFAULT_STIFFNESS = 342;
const DEFAULT_DAMPING = 30;
const DEFAULT_THRESHOLD = .001;
// Springs are a core primitive in Material Motion, yet, the implementations we
// have are all from 3rd party libraries.  Thus, the common
// getters/setters/properties live here, and each implementation can extend it
// to implement its own `value$`.
class NumericSpring {
    constructor() {
        this.destination$ = createProperty({
            initialValue: 0,
        });
        this.initialValue$ = createProperty({
            initialValue: 0,
        });
        this.initialVelocity$ = createProperty({
            initialValue: 0,
        });
        this.stiffness$ = createProperty({
            initialValue: DEFAULT_STIFFNESS,
        });
        this.damping$ = createProperty({
            initialValue: DEFAULT_DAMPING,
        });
        this.threshold$ = createProperty({
            initialValue: DEFAULT_THRESHOLD,
        });
        this.enabled$ = createProperty({
            initialValue: true,
        });
        this.state$ = createProperty({
            initialValue: State$1.AT_REST,
        });
        this.value$ = new MotionObservable$1((observer) => {
            const spring = new Spring();
            const updateSpringConfig = spring.updateConfig.bind(spring);
            let initialized = false;
            let initialValueChangedWhileDisabled = false;
            let initialVelocityChangedWhileDisabled = false;
            this.state$.write(State$1.AT_REST);
            spring.onStart(() => {
                this.state$.write(State$1.ACTIVE);
            });
            spring.onUpdate(() => {
                observer.next(spring.currentValue);
            });
            spring.onStop(() => {
                this.state$.write(State$1.AT_REST);
            });
            // During initialization, the configuration values will be set in the
            // order they are subscribed to; hence,
            const subscriptions = [
                // properties that configure the spring
                this.stiffness$._map(transformToValueWithKey('stiffness')).subscribe(updateSpringConfig),
                this.damping$._map(transformToValueWithKey('damping')).subscribe(updateSpringConfig),
                this.threshold$._map(transformToValueWithKey('restDisplacementThreshold')).subscribe(updateSpringConfig),
                // properties that initialize the spring
                this.initialVelocity$.subscribe((initialVelocity) => {
                    if (this.enabled$.read()) {
                        updateSpringConfig({ initialVelocity });
                    }
                    else {
                        initialVelocityChangedWhileDisabled = true;
                    }
                }),
                this.initialValue$.subscribe((initialValue) => {
                    // We need to figure out what the right interplay is between
                    // `initialValue` and `value$`.  It's probably more convenient for
                    // an author if changes to `initialValue` are passed through to
                    // `value$`. This means you can do something like
                    // `spring.value$.subscribe(location$)` and trust `location$` is
                    // always up-to-date.  However, it's unclear how that would affect
                    // `state$`.  Should `state$` go at_rest -> active -> at_rest every
                    // time something touches `initialValue`?  Should `value$` be able
                    // to emit `initialValue$` without touching `value$`?  Should we
                    // require authors to worry about connecting the two?
                    //
                    // Punting on this for now and forcing authors to deal with it.
                    if (this.enabled$.read()) {
                        updateSpringConfig({ fromValue: initialValue });
                        observer.next(initialValue);
                    }
                    else {
                        initialValueChangedWhileDisabled = true;
                    }
                }),
                // properties that can start/stop the spring
                this.enabled$.subscribe((enabled) => {
                    if (initialized) {
                        if (enabled) {
                            // For simple cases, the spring can manage its own state;
                            // however, we provide property APIs (like initialValue$) for
                            // situations where it should be managed externally.
                            //
                            // The ability to manage this state externally shouldn't require
                            // every author to do so; hence, we use dirty-checking to only
                            // initialize the spring's values if the author has used these
                            // features.
                            //
                            // There's probably a more elegant way to do this (queueing up
                            // changes as they come through and then applying the most
                            // recent one when enabled is set), but this is the simplest
                            // quick solution.
                            const springConfig = {
                                toValue: this.destination$.read(),
                            };
                            if (initialValueChangedWhileDisabled) {
                                const initialValue = this.initialValue$.read();
                                springConfig.fromValue = initialValue;
                                observer.next(initialValue);
                            }
                            if (initialVelocityChangedWhileDisabled) {
                                springConfig.initialVelocity = this.initialVelocity$.read();
                            }
                            updateSpringConfig(springConfig);
                            spring.start();
                            initialValueChangedWhileDisabled = false;
                            initialVelocityChangedWhileDisabled = false;
                        }
                        else {
                            spring.stop();
                        }
                    }
                }),
                this.destination$.subscribe((destination) => {
                    if (this.enabled$.read()) {
                        updateSpringConfig({ toValue: destination });
                        spring.start();
                    }
                }),
            ];
            initialized = true;
            return function disconnect() {
                subscriptions.forEach(subscription => subscription.unsubscribe());
            };
        })._remember();
    }
    get destination() {
        return this.destination$.read();
    }
    set destination(value) {
        this.destination$.write(value);
    }
    get initialValue() {
        return this.initialValue$.read();
    }
    set initialValue(value) {
        this.initialValue$.write(value);
    }
    get initialVelocity() {
        return this.initialVelocity$.read();
    }
    set initialVelocity(value) {
        this.initialVelocity$.write(value);
    }
    get stiffness() {
        return this.stiffness$.read();
    }
    set stiffness(value) {
        this.stiffness$.write(value);
    }
    get damping() {
        return this.damping$.read();
    }
    set damping(value) {
        this.damping$.write(value);
    }
    get threshold() {
        return this.threshold$.read();
    }
    set threshold(value) {
        this.threshold$.write(value);
    }
    get enabled() {
        return this.enabled$.read();
    }
    set enabled(value) {
        this.enabled$.write(value);
    }
    get state() {
        return this.state$.read();
    }
}
function transformToValueWithKey(key) {
    return {
        transform(value) {
            return {
                [key]: value,
            };
        },
    };
}


/**
 * `Point2DSpring` is a spring that accepts and emits `Point2D`s for its
 * configuration values.  Internally, it is composed of two independent
 * `NumericSpring`s.
 *
 * Because each internal spring emits independently, `value$` will emit
 * intermediate values (e.g. changing `initialValue` from `{ x: 0, y: 0 }` to
 * `{ x: 5, y: 4 }` will cause 2 emissions, one when `x` changes and one when
 * `y` changes.)  This may be corrected in a future release, when emits could be
 * batched into one per frame.
 */
class Point2DSpring {
    constructor() {
        this.xSpring = new NumericSpring();
        this.ySpring = new NumericSpring();
        this.destination$ = createProperty({
            initialValue: { x: 0, y: 0 },
        });
        this.initialValue$ = createProperty({
            initialValue: { x: 0, y: 0 },
        });
        this.initialVelocity$ = createProperty({
            initialValue: { x: 0, y: 0 },
        });
        this.stiffness$ = createProperty({
            initialValue: DEFAULT_STIFFNESS,
        });
        this.damping$ = createProperty({
            initialValue: DEFAULT_DAMPING,
        });
        this.threshold$ = createProperty({
            initialValue: DEFAULT_THRESHOLD,
        });
        this.enabled$ = createProperty({
            initialValue: true,
        });
        this.state$ = anyOf([
            this.xSpring.state$.isAnyOf([State.ACTIVE]),
            this.ySpring.state$.isAnyOf([State.ACTIVE]),
        ]).dedupe().rewrite({
            mapping: {
                true: State.ACTIVE,
                false: State.AT_REST,
            },
        })._remember();
        // Since this emits `Point2D`s, it's probably safe to presume it will be used
        // for translation.  But, to be consistent with `NumericSpring`, we write
        // outputs to `value$` rather than `styleStreams`.
        // If `value$` were debounced, it would emit its terminal value after `state$`
        // is `AT_REST`.  This might be OK in practice (since there would only be one
        // final frame emitted while the interaction is `AT_REST`).  However, to
        // maintain the contract that `state$` will be `ACTIVE` whenever the stream is
        // animating, and to make testing simpler, we don't debounce here.
        //
        // If it were debounced, we'd have to either ensure that `state$` waits until
        // the next frame before emitting `AT_REST`, or accept that they are out-of-
        // sync and add an extra mockRAF.step() to the relevant tests.
        this.value$ = combineLatest({
            x: this.xSpring.value$,
            y: this.ySpring.value$,
        });
        subscribe({
            sink: this.xSpring.destination$,
            source: this.destination$.pluck('x'),
        });
        subscribe({
            sink: this.ySpring.destination$,
            source: this.destination$.pluck('y'),
        });
        subscribe({
            sink: this.xSpring.initialValue$,
            source: this.initialValue$.pluck('x'),
        });
        subscribe({
            sink: this.ySpring.initialValue$,
            source: this.initialValue$.pluck('y'),
        });
        subscribe({
            sink: this.xSpring.initialVelocity$,
            source: this.initialVelocity$.pluck('x'),
        });
        subscribe({
            sink: this.ySpring.initialVelocity$,
            source: this.initialVelocity$.pluck('y'),
        });
        subscribe({
            sinks: [
                this.xSpring.stiffness$,
                this.ySpring.stiffness$,
            ],
            source: this.stiffness$,
        });
        subscribe({
            sinks: [
                this.xSpring.damping$,
                this.ySpring.damping$,
            ],
            source: this.damping$,
        });
        subscribe({
            sinks: [
                this.xSpring.threshold$,
                this.ySpring.threshold$,
            ],
            source: this.threshold$,
        });
        subscribe({
            sinks: [
                this.xSpring.enabled$,
                this.ySpring.enabled$,
            ],
            source: this.enabled$,
        });
    }
    get destination() {
        return this.destination$.read();
    }
    set destination(value) {
        this.destination$.write(value);
    }
    get initialValue() {
        return this.initialValue$.read();
    }
    set initialValue(value) {
        this.initialValue$.write(value);
    }
    get initialVelocity() {
        return this.initialVelocity$.read();
    }
    set initialVelocity(value) {
        this.initialVelocity$.write(value);
    }
    get stiffness() {
        return this.stiffness$.read();
    }
    set stiffness(value) {
        this.stiffness$.write(value);
    }
    get damping() {
        return this.damping$.read();
    }
    set damping(value) {
        this.damping$.write(value);
    }
    get threshold() {
        return this.threshold$.read();
    }
    set threshold(value) {
        this.threshold$.write(value);
    }
    get enabled() {
        return this.enabled$.read();
    }
    set enabled(value) {
        this.enabled$.write(value);
    }
    get state() {
        return this.state$._read();
    }
}


var SwipeState;
(function (SwipeState) {
    SwipeState["NONE"] = "none";
    SwipeState["LEFT"] = "left";
    SwipeState["RIGHT"] = "right";
})(SwipeState || (SwipeState = {}));
class Swipeable {
    constructor({ tossable, width$ }) {
        this.iconSpring = new NumericSpring();
        this.backgroundSpring = new NumericSpring();
        // Should `State` be called `MotionState` so `state$` can be reserved for interactions?
        this.swipeState$ = createProperty({ initialValue: SwipeState.NONE });
        /**
         * If an item is swiped past the threshold, it will animate by its own width
         * + destinationMargin, in the direction of the swipe.
         *
         * This ensures that decoration that might overflow an item's bounds (like a
         * shadow) isn't visible when it's been swiped away.
         */
        this.destinationMargin$ = createProperty({
            initialValue: 0,
        });
        this.tossable = tossable;
        this.width$ = width$;
        this.state$ = this.tossable.state$;
        tossable.draggable.axis = Axis$1.X;
        const ICON_SPRING_INITIAL_VALUE = 0.67;
        const draggable = tossable.draggable;
        const spring = tossable.spring;
        const draggedX$ = tossable.draggedLocation$.pluck({ path: 'x' });
        this.iconSpring.initialValue = ICON_SPRING_INITIAL_VALUE;
        this.direction$ = draggedX$.threshold(0).isAnyOf([ThresholdRegion$1.ABOVE]).rewrite({
            mapping: {
                true: Direction$1.RIGHT,
                false: Direction$1.LEFT,
            }
        });
        this.isThresholdMet$ = draggedX$.distanceFrom(0).threshold(Swipeable.VISUAL_THRESHOLD).isAnyOf([
            ThresholdRegion$1.ABOVE,
            ThresholdRegion$1.WITHIN,
        ]);
        this.whenThresholdCrossed$ = when(this.isThresholdMet$.dedupe());
        subscribe({
            sink: this.backgroundSpring.destination$,
            source: this.isThresholdMet$.rewrite({
                mapping: {
                    true: 1,
                    false: 0,
                }
            }),
        });
        subscribe({
            sink: this.iconSpring.destination$,
            source: this.isThresholdMet$.rewrite({
                mapping: {
                    true: 1,
                    false: ICON_SPRING_INITIAL_VALUE,
                }
            }),
        });
        // This needs to also take velocity into consideration; right now, it only
        // cares about final position.
        subscribe({
            sink: this.swipeState$,
            source: when(draggable.state$.isAnyOf([State$1.AT_REST])).rewriteTo({
                value$: this.isThresholdMet$.rewrite({
                    mapping: {
                        true: this.direction$,
                        false: SwipeState.NONE,
                    },
                }),
                onlyEmitWithUpstream: true,
            }),
        });
        const destinationDistance$ = width$.addedBy(this.destinationMargin$);
        subscribe({
            sink: spring.destination$,
            source: combineLatest({
                x: this.swipeState$.rewrite({
                    mapping: {
                        [SwipeState.NONE]: 0,
                        [SwipeState.LEFT]: destinationDistance$.multipliedBy(-1),
                        [SwipeState.RIGHT]: destinationDistance$,
                    }
                }),
                y: 0,
            })
        });
        this.styleStreamsByTargetName = {
            item: tossable.styleStreams,
            icon: {
                scale$: this.iconSpring.value$,
                willChange$: tossable.styleStreams.willChange$,
            },
            background: {
                scale$: this.backgroundSpring.value$,
                willChange$: tossable.styleStreams.willChange$,
            },
        };
    }
    get destinationMargin() {
        return this.destinationMargin$.read();
    }
    set destinationMargin(value) {
        this.destinationMargin$.write(value);
    }
}
Swipeable.VISUAL_THRESHOLD = 72;


class Tossable {
    constructor({ draggable, spring }) {
        this.state$ = createProperty({
            initialValue: State$1.AT_REST,
        });
        /**
         * This is the point from which all other resistance calculations are
         * measured.
         */
        this.resistanceOrigin$ = createProperty({
            initialValue: { x: 0, y: 0 },
        });
        /**
         * This is the distance from the origin that an item can be freely dragged
         * without encountering resistance.
         */
        this.radiusUntilResistance$ = createProperty({
            initialValue: 0,
        });
        /**
         * For carousels or swipeable lists, this is the width of one item.
         *
         * To apply resistance, the calculation needs to determine the amount of
         * progress through a drag.  `resistanceBasis` is the denominator in this
         * calculation. For instance, if a drag is 20px beyond `radiusUntilResistance`
         * and `resistanceBasis` is 50, the drag progress used by the resistance
         * calculation is 40%.
         *
         * Note: a drag cannot move farther than `resistanceBasis` beyond
         * `radiusUntilResistance`.
         */
        this.resistanceBasis$ = createProperty({
            initialValue: 0,
        });
        /**
         * This value determines how far beyond `radiusUntilResistance` a drag is
         * limited to.
         *
         * It works in conjunction with `resistanceBasis`.  If `resistanceBasis` is 50
         * and `resistanceFactor` is 5, the drag is limited to 10px (basis / factor)
         * beyond `radiusUntilResistance`.
         */
        this.resistanceFactor$ = createProperty({
            initialValue: 0,
        });
        this.location$ = createProperty({
            initialValue: { x: 0, y: 0 },
        });
        this.draggable = draggable;
        this.spring = spring;
        const dragIsAtRest$ = draggable.state$.rewrite({
            mapping: {
                [State$1.AT_REST]: true,
                [State$1.ACTIVE]: false,
            }
        }).dedupe();
        const whenDragIsAtRest$ = when(dragIsAtRest$);
        const whenDragIsActive$ = when(not(dragIsAtRest$));
        // This block needs to come before the one that sets spring enabled to
        // ensure the spring initializes with the correct values; otherwise, it will
        // start from 0
        subscribe({
            sink: spring.initialValue$,
            source: this.location$._debounce({ pulse$: whenDragIsAtRest$ }),
        });
        const locationOnDown$ = this.location$._debounce({ pulse$: whenDragIsActive$ });
        this.draggedLocation$ = draggable.value$.addedBy({
            value$: locationOnDown$,
            onlyEmitWithUpstream: true
        })._reactiveMap({
            transform: ({ upstream: location, resistanceOrigin, radiusUntilResistance, resistanceBasis, resistanceFactor, }) => {
                if (!resistanceFactor) {
                    return location;
                }
                // We apply resistance radially, leading to all the trig below.  In most
                // cases, the draggable element will be axis locked, which means there's
                // room to short circuit the logic here with simpler solutions when we
                // know either x or y is constant.
                const locationFromOrigin = {
                    x: location.x - resistanceOrigin.x,
                    y: location.y - resistanceOrigin.y,
                };
                const overflowRadius = Math.sqrt(Math.pow(locationFromOrigin.x, 2) + Math.pow(locationFromOrigin.y, 2)) - radiusUntilResistance;
                const resistanceProgress = Math.max(0, Math.min(1, overflowRadius / resistanceBasis));
                if (overflowRadius < 0) {
                    return location;
                }
                const radiusWithResistance = resistanceBasis / resistanceFactor * Math.sin(resistanceProgress * Math.PI / 2) + radiusUntilResistance;
                const angle = Math.atan2(locationFromOrigin.y, locationFromOrigin.x);
                return {
                    x: resistanceOrigin.x + radiusWithResistance * Math.cos(angle),
                    y: resistanceOrigin.y + radiusWithResistance * Math.sin(angle),
                };
            },
            inputs: {
                resistanceOrigin: this.resistanceOrigin$,
                radiusUntilResistance: this.radiusUntilResistance$,
                resistanceBasis: this.resistanceBasis$,
                resistanceFactor: this.resistanceFactor$,
            },
            onlyEmitWithUpstream: true,
        });
        this.velocity$ = getVelocity$({
            // Since drag starts at rest, whenDragIsAtRest$ emits immediately.  Thus,
            // we start with { 0, 0 } to ensure velocity doesn't emit undefined.
            value$: this.draggedLocation$.startWith({ x: 0, y: 0 }),
            pulse$: whenDragIsAtRest$,
        });
        subscribe({
            sink: spring.initialVelocity$,
            source: this.velocity$,
        });
        subscribe({
            sink: spring.enabled$,
            source: dragIsAtRest$,
        });
        subscribe({
            sink: this.state$,
            source: anyOf([
                spring.state$.isAnyOf([State$1.ACTIVE]),
                draggable.state$.isAnyOf([State$1.ACTIVE]),
            ]).rewrite({
                mapping: {
                    true: State$1.ACTIVE,
                    false: State$1.AT_REST,
                },
            }).dedupe(),
        });
        subscribe({
            sink: this.location$,
            source: spring.enabled$.rewrite({
                mapping: {
                    true: spring.value$,
                    false: this.draggedLocation$,
                },
                emitOnKeyChange: false,
            })._debounce(),
        });
        this.styleStreams = {
            translate$: this.location$,
            willChange$: this.state$.rewrite({
                mapping: {
                    [State$1.ACTIVE]: 'transform',
                    [State$1.AT_REST]: '',
                },
            }),
        };
    }
    get state() {
        return this.state$.read();
    }
    get resistanceOrigin() {
        return this.resistanceOrigin$.read();
    }
    set resistanceOrigin(value) {
        this.resistanceOrigin$.write(value);
    }
    get radiusUntilResistance() {
        return this.radiusUntilResistance$.read();
    }
    set radiusUntilResistance(value) {
        this.radiusUntilResistance$.write(value);
    }
    get resistanceBasis() {
        return this.resistanceBasis$.read();
    }
    set resistanceBasis(value) {
        this.resistanceBasis$.write(value);
    }
    get resistanceFactor() {
        return this.resistanceFactor$.read();
    }
    set resistanceFactor(value) {
        this.resistanceFactor$.write(value);
    }
}
function applyLinearResistanceToTossable({ tossable, min$, max$, axis$, basis$, factor$, }) {
    subscribe({
        sink: tossable.resistanceBasis$,
        source: basis$,
    });
    subscribe({
        sink: tossable.resistanceFactor$,
        source: factor$,
    });
    subscribe({
        sink: tossable.radiusUntilResistance$,
        source: min$._reactiveMap({
            transform: ({ upstream: min, max }) => Math.abs(max - min) / 2,
            inputs: {
                max: max$,
            }
        }),
    });
    subscribe({
        sink: tossable.resistanceOrigin$,
        source: axis$._reactiveMap({
            transform: ({ upstream: axis, min, max }) => {
                const linearCenter = min + (max - min) / 2;
                if (axis === Axis$1.X) {
                    return {
                        x: linearCenter,
                        y: 0,
                    };
                }
                else if (axis === Axis$1.Y) {
                    return {
                        x: 0,
                        y: linearCenter,
                    };
                }
                else {
                    console.warn(`Cannot apply linear resistance if axis isn't locked`);
                }
            },
            inputs: {
                min: min$,
                max: max$,
            },
        }),
    });
}




// Passive event feature detection from
// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
let supportsPassiveListeners = false;
try {
    const eventOptions = Object.defineProperty({}, 'passive', {
        get() {
            supportsPassiveListeners = true;
        }
    });
    window.addEventListener("test", () => { }, eventOptions);
}
catch (e) { }
function getEventStreamFromElement(type, element, eventListenerOptions = { passive: true }) {
    return new MotionObservable$1((observer) => {
        if (!supportsPassiveListeners) {
            eventListenerOptions = (eventListenerOptions.capture || false);
        }
        const next = observer.next.bind(observer);
        // For some reason, TypeScript has an interface for
        // AddEventListenerOptions, but its addEventListener signature hasn't been
        // updated to use it, so for now, we manually cast to boolean.
        //
        // https://github.com/Microsoft/TypeScript/issues/18136
        element.addEventListener(type, next, eventListenerOptions);
        return () => {
            element.removeEventListener(type, next, eventListenerOptions);
        };
    });
}


// TODO(#250): Merge StyleStreams and csstype
function combineStyleStreams(styleStreams) {
    return combineLatest(stripStreamSuffices(styleStreams), { waitForAllValues: false })._debounce()._map({
        transform: (_a) => {
            var { willChange = '', opacity = 1, translate = { x: 0, y: 0 }, rotate = 0, scale = 1, borderRadius = '', transformOrigin = { x: 0, y: 0 }, dimensions = {} } = _a, passthrough = __rest(_a, ["willChange", "opacity", "translate", "rotate", "scale", "borderRadius", "transformOrigin", "dimensions"]);
            return (Object.assign({}, passthrough, { borderRadius: Array.isArray(borderRadius)
                    ? borderRadius.map(appendPixels).join(' ')
                    : borderRadius, opacity: typeof opacity === 'number'
                    ? Number(opacity.toFixed(3))
                    : opacity, transform: buildTransformString({ translate, rotate, scale }), transformOrigin: `${appendPixels(transformOrigin.x)} ${appendPixels(transformOrigin.y)}`, width: appendPixels(dimensions.width || passthrough.width), height: appendPixels(dimensions.height || passthrough.height), willChange }));
        }
    });
}
function buildTransformString({ translate: { x: translateX = 0, y: translateY = 0 } = {}, rotate = 0, scale = 1, }) {
    return `
    translate(${appendPixels(translateX)}, ${appendPixels(translateY)})
    rotate(${appendRadians(rotate)})
    scale(${scale})
  `;
}
function applySuffix(value, suffix = '') {
    if (typeof value === 'number') {
        return value + suffix;
    }
    return value;
}
// Poor-man's currying
function appendPixels(value) {
    return applySuffix(value, 'px');
}
function appendRadians(value) {
    return applySuffix(value, 'rad');
}
function stripStreamSuffices(dictWithSufficies) {
    const result = {};
    Object.keys(dictWithSufficies).forEach(key => {
        result[key.replace('$', '')] = dictWithSufficies[key];
    });
    return result;
}


// TouchEvent types from https://developer.apple.com/reference/webkitjs/touchevent/
// PointerEvent types from https://w3c.github.io/pointerevents/
const TOUCH_TYPE_TO_POINTER_TYPE = {
    'touchstart': 'pointerdown',
    'touchmove': 'pointermove',
    'touchend': 'pointerup',
    'touchcancel': 'pointercancel',
};
function convertTouchEventsToPointerEvents(touchEvent$) {
    return touchEvent$._map({
        transform: ({ type, targetTouches, changedTouches }) => Array.from(['touchend', 'touchcancel'].includes(type)
            ? changedTouches
            : targetTouches, ({ clientX, clientY, identifier }) => ({
            // `PointerEvent` defines `x` and `y` as aliases for `clientX` and
            // `clientY`, but `TouchEvent` doesn't have the same sugar.
            x: clientX,
            y: clientY,
            pointerId: identifier,
            type: TOUCH_TYPE_TO_POINTER_TYPE[type]
        }))
    })._flattenIterables();
}


function createCustomPropertyObserver(styleName, target = document.documentElement) {
    return function (value) {
        target.style.setProperty(styleName, value.toString());
    };
}


const notPassive = {
    passive: false,
    capture: true,
};
function getPointerEventStreamsFromElement(element) {
    const commonStreams = {
        contextMenu$: getEventStreamFromElement('click', element),
        // These are streams that a gesture recognizer may want to interrupt when it
        // recognizes a gesture is happening.
        capturedClick$: getEventStreamFromElement('click', element, notPassive),
        capturedDragStart$: getEventStreamFromElement('dragstart', element, notPassive),
    };
    if (typeof PointerEvent !== 'undefined') {
        return Object.assign({ down$: getEventStreamFromElement('pointerdown', element), move$: getEventStreamFromElement('pointermove', element), up$: getEventStreamFromElement('pointerup', element), cancel$: getEventStreamFromElement('pointercancel', element) }, commonStreams);
    }
    else {
        return Object.assign({ down$: getEventStreamFromElement('mousedown', element).merge([
                convertTouchEventsToPointerEvents(getEventStreamFromElement('touchstart', element)),
            ]), move$: getEventStreamFromElement('mousemove', element).merge([
                convertTouchEventsToPointerEvents(getEventStreamFromElement('touchmove', element)),
            ]), up$: getEventStreamFromElement('mouseup', element).merge([
                convertTouchEventsToPointerEvents(getEventStreamFromElement('touchend', element)),
            ]), cancel$: convertTouchEventsToPointerEvents(getEventStreamFromElement('touchcancel', element)) }, commonStreams);
    }
}


// If/when we care about isomorphic dependents, we can check `typeof window`
// here and export an empty stream if it's undefined.
const viewportDimensions$ = getEventStreamFromElement('resize', window).startWith({ value: {} })._map({
    // Using _map instead of rewriteTo because it should be reevaluated on
    // every resize.
    transform: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }),
})._remember();



export default undefined;
export { Axis$1 as Axis, Direction$1 as Direction, GestureRecognitionState$1 as GestureRecognitionState, State$1 as State, ThresholdRegion$1 as ThresholdRegion, isBoolean, isDefined, isDimensions, isNumber, isObservable, isMap, isPoint2D, isObserver, isPointerEvent, isIterable, isTimestamped, IndefiniteSubject, MemorylessIndefiniteSubject, MemorylessMotionSubject$1 as MemorylessMotionSubject, MotionObservable$1 as MotionObservable, MotionProperty$1 as MotionProperty, MotionSubject$1 as MotionSubject, ReactiveProperty, createProperty, BaseMotionObservable, anyOf, allOf, noneOf, not, when, subscribe, combineLatest, getFrame$, MAXIMUM_AGE, MAXIMUM_INCOMING_DISPATCHES, getVelocity$, Draggable, NumericSpring, Point2DSpring, Swipeable, Tossable, DEFAULT_STIFFNESS, DEFAULT_DAMPING, DEFAULT_THRESHOLD, SwipeState, applyLinearResistanceToTossable, viewportDimensions$, combineStyleStreams, convertTouchEventsToPointerEvents, createCustomPropertyObserver, getEventStreamFromElement, getPointerEventStreamsFromElement, buildTransformString, applySuffix, appendPixels, appendRadians };
