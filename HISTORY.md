# History

## v5.8.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.7.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.6.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.5.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.4.0 2020 May 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.3.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.2.0 2020 May 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.1.0 2020 May 8

-   Add support for Regular Expressions for `file` and `method` offsets, to support such things as case insentitivity

## v5.0.0 2020 May 8

-   Breaking Change:

    Offset intention is now compatible with v3 and below. That is, skipping will continue until:

        1. The file or method is found
        2. Once found, will continue until neither the file nor method are found anymore
        3. Once exited, the frame offset will then apply

    If you still wish to capture the method or the file, combine them with `frames: -1`.

## v4.0.0 2020 May 8

-   Breaking Change:

    Behaviour of the offset has changed, it now continues until the provided file (if any) or method (if any) is found, once found, it will then continue for the specified frames (if any).

    This does not affect you if you never passed an offset, however if you did, you probably want to add `frames: 1` so that it continues oen more stack frame to the probable caller, rather than just stopping at the frame of the found method or file.

    The `lines` offset parameter has been discarded and replaced by `frames`, however you probably always want to use `frames` with a `file` or `method` be sure to specify it.

    The default offset properties now only apply if no properties were specified, rather than just if a particular property was empty.

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.1.0 2020 May 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.0.0 2020 March 26

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v2.0.0 2019 December 12

-   Offset is now an object that supports `file`, `method`, and `line`

## v1.0.0 2019 December 12

-   Extracted out from [Caterpillar v4.0.0](https://github.com/bevry/caterpillar/blob/20fde0ae4519f178ef0768e8183b4e413a44fcd1/source/logger.js#L202-L297)
