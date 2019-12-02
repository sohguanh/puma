const AsyncLock = require('async-lock')

class SlidingWindowTuple {
  constructor (count, minuteMark) {
    this.count = count
    this.minuteMark = minuteMark
  }

  getCount () {
    return this.count
  }

  getMinuteMark () {
    return this.minuteMark
  }

  setCount (count) {
    this.count = count
  }

  setMinuteMark (minuteMark) {
    this.minuteMark = minuteMark
  }
}

class SlidingWindow {
  /*
  requestPerMin parameter to indicate how many request the url endpoint can handle per minute before rejecting.
  */
  constructor (logger, requestPerMin = 30) {
    this.logger = logger
    this.requestPerMin = requestPerMin
    this.list = []
    this.lock = new AsyncLock()
  }

  isAllowed () {
    let allowed = true
    this.lock.acquire('token', () => {
      allowed = this.ok()
    }, {}).then(() => {
      // lock released
    })
    return allowed
  }

  weightFormula (prevCounter, currMinuteMarkPct, currCounter) {
    return Math.floor(prevCounter.toFixed(2) * (1.0 - currMinuteMarkPct)) + currCounter
  }

  ok () {
    const logger = this.logger
    const currDate = new Date()
    const currMin = currDate.getMinutes()
    const currSec = currDate.getSeconds()
    const cnt = this.list.length
    if (cnt === 0) {
      this.list.push(new SlidingWindowTuple(1, currMin))
      return true
    } else if (cnt <= 2) {
      logger.debug('cnt: ' + cnt)
      const front = this.list[0]
      if (front.getMinuteMark() === currMin) { // within same bucket
        logger.debug('within same bucket')
        if (cnt === 2) { // check previous bucket apply formula
          const back = this.list[1]
          if ((this.weightFormula(back.getCount(), (currSec / 60).toFixed(2), front.getCount())) > this.requestPerMin) {
            logger.debug('within same bucket reject 0')
            return false
          }
        }
        const newCount = front.getCount() + 1
        if (newCount > this.requestPerMin) {
          logger.debug('within same bucket reject 1 with newCount ' + newCount)
          return false
        } else {
          front.setCount(newCount)
          return true
        }
      } else { // not found in current bucket
        logger.debug('not same bucket')
        let prevMinuteMark = currMin - 1
        if (currMin === 0) {
          prevMinuteMark = 59
        }
        if (front.getMinuteMark() === prevMinuteMark) {
          // check if allowed using weightFormula
          if (this.weightFormula(front.getCount(), (currSec / 60).toFixed(2), 0) > this.requestPerMin) {
            logger.debug('not same bucket reject 0')
            return false
          } else {
            if (cnt === 1) {
              // if cnt == 1 add new bucket in front
              this.list.unshift(new SlidingWindowTuple(1, currMin))
            } else if (cnt === 2) {
              // if cnt == 2
              // copy front bucket to back bucket
              // overwrite front bucket with new counter value
              const back = this.list[1]

              back.setCount(front.getCount())
              back.setMinuteMark(front.getMinuteMark())

              front.setCount(1)
              front.setMinuteMark(currMin)
            }
            return true
          }
        } else {
          if (cnt === 1) {
            // if cnt == 1 > 1 min interval so just overwrite front bucket with new counter value
            front.setCount(1)
            front.setMinuteMark(currMin)
          } else if (cnt === 2) {
            // if cnt == 2 > 1 min interval so just overwrite front bucket with new counter value
            // remove the back bucket as not needed for compare anymore
            front.setCount(1)
            front.setMinuteMark(currMin)

            this.list.pop()
          }
          return true
        }
      }
    }
    logger.debug('outside reject 999')
    return false // not supposed to come here but if it does return false by default
  }
}

module.exports = {
  SlidingWindow
}
